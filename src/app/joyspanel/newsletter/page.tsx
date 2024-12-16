'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  EnvelopeIcon, 
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'new-blog',
    name: 'Nouveau Blog',
    subject: 'Nouveau blog - Joy\'s Hypnose',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #be185d; font-size: 28px; margin-bottom: 10px;">Nouveau blog sur Joy's Hypnose</h1>
          <div style="width: 50px; height: 2px; background-color: #be185d; margin: 0 auto;"></div>
        </div>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Cher(e) abonné(e),</p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Un nouveau blog vient d'être publié sur notre site :</p>
        
        <div style="background-color: #fdf2f8; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #fbcfe8;">
          <h2 style="color: #be185d; font-size: 22px; margin-top: 0;">[TITRE DU BLOG]</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">[DESCRIPTION]</p>
          <a href="[LIEN]" style="display: inline-block; background-color: #be185d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; margin-top: 15px; font-weight: bold; transition: background-color 0.3s ease;">Lire l'article</a>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #4a5568; margin-bottom: 5px;">À très bientôt,</p>
          <p style="color: #be185d; font-weight: bold; font-size: 18px;">Joy's Hypnose</p>
          <div style="margin-top: 20px;">
            <a href="https://www.joyshypnose-therapies.com" style="color: #be185d; text-decoration: none;">www.joyshypnose-therapies.com</a>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'monthly-news',
    name: 'Newsletter Mensuelle',
    subject: 'Actualités mensuelles - Joy\'s Hypnose',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #be185d; font-size: 28px; margin-bottom: 10px;">Newsletter Mensuelle</h1>
          <div style="width: 50px; height: 2px; background-color: #be185d; margin: 0 auto;"></div>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Cher(e) abonné(e),</p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Voici les dernières actualités de Joy's Hypnose :</p>

        <div style="background-color: #fdf2f8; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #fbcfe8;">
          [CONTENU DE LA NEWSLETTER]
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #4a5568; margin-bottom: 5px;">À très bientôt,</p>
          <p style="color: #be185d; font-weight: bold; font-size: 18px;">Joy's Hypnose</p>
          <div style="margin-top: 20px;">
            <a href="https://www.joyshypnose-therapies.com" style="color: #be185d; text-decoration: none;">www.joyshypnose-therapies.com</a>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'promotion',
    name: 'Offre Spéciale',
    subject: 'Offre spéciale - Joy\'s Hypnose',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #be185d; font-size: 32px; margin-bottom: 10px;">⭐ Offre Spéciale ⭐</h1>
          <div style="width: 50px; height: 2px; background-color: #be185d; margin: 0 auto;"></div>
        </div>

        <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fff 100%); padding: 30px; border-radius: 15px; margin: 25px 0; border: 2px solid #fbcfe8; text-align: center;">
          <h2 style="color: #be185d; font-size: 24px; margin-top: 0;">[TITRE DE L'OFFRE]</h2>
          <div style="font-size: 48px; color: #be185d; margin: 20px 0; font-weight: bold;">[RÉDUCTION]</div>
          <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin-bottom: 25px;">[DESCRIPTION DE L'OFFRE]</p>
          <div style="background-color: #fecdd3; padding: 15px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
            <p style="color: #be185d; font-weight: bold; margin: 0;">Code promo : [CODE]</p>
          </div>
          <br>
          <a href="[LIEN]" style="display: inline-block; background-color: #be185d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 18px; transition: background-color 0.3s ease;">Réserver maintenant</a>
          <p style="color: #666; font-size: 14px; margin-top: 15px;">Offre valable jusqu'au [DATE]</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #4a5568; margin-bottom: 5px;">À très bientôt,</p>
          <p style="color: #be185d; font-weight: bold; font-size: 18px;">Joy's Hypnose</p>
          <div style="margin-top: 20px;">
            <a href="https://www.joyshypnose-therapies.com" style="color: #be185d; text-decoration: none;">www.joyshypnose-therapies.com</a>
          </div>
        </div>
      </div>
    `
  }
];

export default function NewsletterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/joyspanel/login');
      return;
    }

    fetchSubscribers();
  }, [status, router]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) return;

    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subscriber');
      
      setSubscribers(prev => prev.filter(sub => sub._id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'unsubscribed' : 'active';
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update subscriber status');
      
      setSubscribers(prev => prev.map(sub => 
        sub._id === id ? { ...sub, status: newStatus } : sub
      ));
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailSubject(template.subject);
    setEmailContent(template.content);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSendNewsletter = async () => {
    if (!emailSubject || !emailContent) {
      alert('Veuillez remplir le sujet et le contenu de l\'email');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir envoyer cette newsletter à tous les abonnés actifs ?')) {
      return;
    }

    setIsSending(true);
    setSendingStatus(null);

    try {
      const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          subscribers: activeSubscribers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send newsletter');
      }
      
      const result = await response.json();
      setSendingStatus(result.stats);
      
      if (result.stats.success > 0) {
        alert(`Newsletter envoyée avec succès à ${result.stats.success} abonnés !`);
        // Reset form only if at least one email was sent successfully
        setEmailSubject('');
        setEmailContent('');
        setSelectedTemplate(null);
      } else {
        alert('Aucun email n\'a pu être envoyé. Veuillez vérifier les logs pour plus de détails.');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Une erreur est survenue lors de l\'envoi de la newsletter: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setIsSending(false);
    }
  };

  const handleTestEmail = async () => {
    if (!emailSubject || !emailContent) {
      alert('Veuillez remplir le sujet et le contenu de l\'email');
      return;
    }

    const testEmail = prompt('Entrez l\'adresse email pour le test:');
    if (!testEmail) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          subscribers: [{ email: testEmail, status: 'active' }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send test email');
      }

      alert('Email de test envoyé avec succès !');
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Erreur lors de l\'envoi de l\'email de test: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeSubscribersCount = subscribers.filter(sub => sub.status === 'active').length;

  return (
    <div className="p-8">
      {/* Email Composer Section */}
      <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Composer une Newsletter</h2>
        
        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle d'email
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {defaultTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedTemplate?.id === template.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                }`}
              >
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Email Subject */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sujet de l'email
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Entrez le sujet de l'email"
          />
        </div>

        {/* Email Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu de l'email
          </label>
          <div className="prose-editor">
            <ReactQuill
              value={emailContent}
              onChange={setEmailContent}
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'font': [] }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'script': 'sub'}, { 'script': 'super' }],
                  [{ 'align': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  ['blockquote', 'code-block'],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              className="h-64 mb-12"
            />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mb-6 border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Aperçu</h3>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium">Sujet: {emailSubject}</h4>
              <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: emailContent }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {activeSubscribersCount} abonnés actifs recevront cette newsletter
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreview}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
            </button>
            <button
              onClick={handleSendNewsletter}
              disabled={isSending || !emailSubject || !emailContent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              {isSending ? 'Envoi en cours...' : 'Envoyer la newsletter'}
            </button>
          </div>
        </div>

        {/* Sending Status */}
        {sendingStatus && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Envoi terminé : {sendingStatus.success} succès, {sendingStatus.failed} échecs
            </p>
          </div>
        )}
      </div>

      {/* Existing Subscribers Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Abonnés</h2>
          <p className="mt-2 text-sm text-gray-700">
            Liste des abonnés à la newsletter
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date d'inscription
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dernière mise à jour
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleStatusToggle(subscriber._id, subscriber.status)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscriber.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {subscriber.status === 'active' ? (
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 mr-1" />
                          )}
                          {subscriber.status === 'active' ? 'Actif' : 'Désabonné'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(subscriber.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(subscriber.updatedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <button
                          onClick={() => handleDelete(subscriber._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 