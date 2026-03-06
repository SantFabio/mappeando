import type { MapItem } from '../../types';

interface Props {
  item: MapItem;
}

export function ItemCard({ item }: Props) {
  return (
    <article className="text-sm max-w-xs font-sans">
      <header className="mb-2">
        <h2 className="font-bold text-base text-gray-800">{item.name || 'Nome não disponível'}</h2>
        <p className="text-gray-500 text-xs">{item.region || 'Região não disponível'}</p>
      </header>

      <div className="space-y-1 text-gray-700">
        <p><span className="font-semibold">Endereço:</span> {item.fullAddress || 'Não disponível'}</p>
        <p><span className="font-semibold">Horário:</span> {item.schedule || 'Não disponível'}</p>
        <p><span className="font-semibold">Processo Seletivo:</span> {item.hasSelectionProcess || 'Não informado'}</p>
        <p><span className="font-semibold">Modalidade Remota:</span> {item.isRemote || 'Não informado'}</p>
        <p><span className="font-semibold">Vagas Presenciais:</span> {item.availableSeatsOnsite ?? 'Não informado'}</p>
        <p><span className="font-semibold">Vagas Remotas:</span> {item.availableSeatsRemote ?? 'Não informado'}</p>
        <p><span className="font-semibold">Contato:</span> {item.phone || 'Não disponível'}</p>
        <p><span className="font-semibold">E-mail:</span> {item.email || 'Não disponível'}</p>
        {item.observations && (
          <p><span className="font-semibold">Observação:</span> {item.observations}</p>
        )}
      </div>

      <footer className="mt-2 space-y-1">
        {item.websiteUrl && (
          <p>
            <span className="font-semibold">Site: </span>
            <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
              {item.websiteUrl}
            </a>
          </p>
        )}
        {item.facebookUrl && (
          <p>
            <a href={item.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">
              Acessar Facebook
            </a>
          </p>
        )}
        {item.instagramUrl && (
          <p>
            <a href={item.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-600 underline">
              Acessar Instagram
            </a>
          </p>
        )}
      </footer>
    </article>
  );
}
