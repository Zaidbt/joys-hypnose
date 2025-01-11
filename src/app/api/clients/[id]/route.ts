import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: { status?: string; isRedFlagged?: boolean; updatedAt: Date } = {
      updatedAt: new Date()
    };

    // Handle status update
    if (body.status) {
      updateData.status = body.status;
    }

    // Handle red flag update
    if (typeof body.isRedFlagged === 'boolean') {
      updateData.isRedFlagged = body.isRedFlagged;
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const clientsCollection = db.collection('appointments');

    // If updating red flag status, update all appointments with the same phone number
    if (typeof body.isRedFlagged === 'boolean') {
      const targetClient = await clientsCollection.findOne({ _id: new ObjectId(params.id) });
      if (targetClient && targetClient.clientPhone) {
        await clientsCollection.updateMany(
          { clientPhone: targetClient.clientPhone },
          { $set: { isRedFlagged: body.isRedFlagged } }
        );
      }
    }

    const result = await clientsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id.toString()
      }
    });

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const clientsCollection = db.collection('appointments');

    const result = await clientsCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 