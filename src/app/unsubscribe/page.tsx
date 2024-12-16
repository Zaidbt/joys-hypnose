import { NoSymbolIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = searchParams.status;
  const email = searchParams.email;

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          title: 'Désabonnement réussi',
          message: 'Vous avez été désabonné avec succès de notre newsletter.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'not-found':
        return {
          icon: ExclamationTriangleIcon,
          title: 'Email non trouvé',
          message: 'Cette adresse email n\'est pas dans notre liste de diffusion.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'error':
        return {
          icon: NoSymbolIcon,
          title: 'Erreur',
          message: 'Une erreur est survenue lors du désabonnement. Veuillez réessayer plus tard.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          title: 'Statut inconnu',
          message: 'Une erreur inattendue s\'est produite.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${content.bgColor} py-8 px-4 shadow sm:rounded-lg sm:px-10 border ${content.borderColor}`}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white">
              <Icon className={`h-6 w-6 ${content.color}`} aria-hidden="true" />
            </div>
            <h2 className={`mt-3 text-lg font-medium ${content.color}`}>
              {content.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {content.message}
              {email && <span className="block mt-1 font-medium">{email}</span>}
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 