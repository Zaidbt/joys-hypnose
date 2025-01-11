import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendConfirmationEmail } from '@/lib/gmail';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Send confirmation email when appointment is confirmed (status changed to 'booked')
    if (status === 'booked') {
      try {
        console.log('Attempting to send confirmation email for appointment:', {
          id: params.id,
          clientName: result.clientName,
          clientEmail: result.clientEmail,
          startTime: result.startTime,
          status: result.status
        });
        
        await sendConfirmationEmail(result);
        console.log('Confirmation email sent successfully for appointment:', params.id);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id.toString()
      }
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
} 