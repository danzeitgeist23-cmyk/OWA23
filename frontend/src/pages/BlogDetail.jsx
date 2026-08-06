import React from 'react';
import { blogPosts } from '../mock';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, ChevronRight } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h1 className="text-3xl font-bold text-[#14213d]" style={{ fontFamily: 'Playfair Display' }}>
            Artículo no encontrado
          </h1>
          <p className="text-gray-500 mt-4">El post que buscas no existe o ha sido eliminado.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 mt-6 text-[#f4623a] font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = (content) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];
    let inTable = false;
    let tableRows = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Horizontal rule
      if (trimmed === '---') {
        elements.push(<hr key={index} className="my-8 border-gray-200" />);
        return;
      }

      // Headers
      if (trimmed.startsWith('## ')) {
        if (inList) { elements.push(<ul key={`list-${index}`} className="list-disc list-inside text-gray-700 mb-6 space-y-2">{listItems}</ul>); listItems = []; inList = false; }
        elements.push(<h2 key={index} className="text-2xl md:text-3xl font-bold text-[#14213d] mt-10 mb-4" style={{ fontFamily: 'Playfair Display' }}>{trimmed.replace('## ', '')}</h2>);
        return;
      }
      if (trimmed.startsWith('### ')) {
        if (inList) { elements.push(<ul key={`list-${index}`} className="list-disc list-inside text-gray-700 mb-6 space-y-2">{listItems}</ul>); listItems = []; inList = false; }
        elements.push(<h3 key={index} className="text-xl font-semibold text-[#14213d] mt-8 mb-3">{trimmed.replace('### ', '')}</h3>);
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        if (inList) { elements.push(<ul key={`list-${index}`} className="list-disc list-inside text-gray-700 mb-6 space-y-2">{listItems}</ul>); listItems = []; inList = false; }
        const quoteText = trimmed.replace('> ', '');
        const isHighlight = quoteText.startsWith('**') || quoteText.includes('**¿Listo') || quoteText.includes('**Dato');
        elements.push(
          <blockquote key={index} className={`border-l-4 border-[#f4623a] pl-6 italic text-gray-600 my-6 ${isHighlight ? 'bg-[#fff5f2] rounded-r-lg p-4' : ''}`}>
            <p className="whitespace-pre-wrap">{quoteText.replace(/\*\*(.*?)\*\*/g, (match, g1) => `<strong>${g1}</strong>`)}</p>
          </blockquote>
        );
        return;
      }

      // Bold inline **text** handling for paragraphs
      const parseBold = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, i) => 
          part.startsWith('**') && part.endsWith('**') 
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
        );
      };

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) inList = true;
        const itemText = trimmed.replace(/^[-*]\s*/, '');
        listItems.push(<li key={index} className="leading-relaxed">{parseBold(itemText)}</li>);
        return;
      } else if (inList) {
        elements.push(<ul key={`list-${index}`} className="list-disc list-inside text-gray-700 mb-6 space-y-2">{listItems}</ul>);
        listItems = [];
        inList = false;
      }

      // Table
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) { inTable = true; tableRows = []; }
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        if (tableRows.length > 0) {
          const headers = tableRows[0];
          const rows = tableRows.slice(1);
          elements.push(
            <div key={index} className="overflow-x-auto my-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#0b7285] text-white">
                    {headers.map((h, i) => <th key={i} className="border border-gray-300 px-4 py-3 text-left font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r} className={r % 2 === 0 ? 'bg-gray-50' : ''}>
                      {row.map((cell, c) => <td key={c} className="border border-gray-300 px-4 py-3">{parseBold(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        inTable = false;
        tableRows = [];
      }

      // Regular paragraph
      if (trimmed && !trimmed.startsWith('|')) {
        elements.push(<p key={index} className="text-gray-700 leading-relaxed mb-4">{parseBold(trimmed)}</p>);
      }
    });

    // Flush remaining list/table
    if (inList && listItems.length > 0) {
      elements.push(<ul key="list-end" className="list-disc list-inside text-gray-700 mb-6 space-y-2">{listItems}</ul>);
    }
    if (inTable && tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1);
      elements.push(
        <div key="table-end" className="overflow-x-auto my-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#0b7285] text-white">
                {headers.map((h, i) => <th key={i} className="border border-gray-300 px-4 py-3 text-left font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className={r % 2 === 0 ? 'bg-gray-50' : ''}>
                  {row.map((cell, c) => <td key={c} className="border border-gray-300 px-4 py-3">{parseBold(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <div className="prose prose-gray max-w-none">{elements}</div>;
  };

  return (
    <article className="pt-24 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#f4623a] transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/blog" className="hover:text-[#f4623a] transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#14213d] font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Post Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-md bg-[#0b7285]/10 text-[11px] font-bold tracking-wider text-[#0b7285]">{post.category}</span>
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-gray-100 text-[11px] font-medium text-gray-600">#{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#14213d] leading-tight mb-6" style={{ fontFamily: 'Playfair Display' }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <figure className="mb-12">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full aspect-[16/9] object-cover rounded-2xl shadow-[0_20px_40px_-20px_rgba(11,33,61,0.2)]"
          />
        </figure>

        {/* Post Content */}
        <div className="text-gray-700 leading-relaxed text-lg">
          {post.content ? renderContent(post.content) : (
            <p className="text-gray-500">Contenido no disponible.</p>
          )}
        </div>

        {/* CTA Section */}
        {post.id === 'ballenas-canarias' && (
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#14213d] to-[#0b7285] text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display' }}>
              ¿Listo para conocer a los gigantes del Atlántico?
            </h2>
            <p className="text-[#0b7285]/90 mb-6 max-w-2xl">
              Sube a bordo del <strong>Ocean Giants Cruise</strong> y vive el avistamiento de calderones, cachalotes y delfines con guía biólogo marino, hidrófono y baño en cala secreta.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/actividad/ocean-giants-cruise" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#14213d] font-semibold hover:bg-gray-100 transition-colors"
              >
                Reservar Ocean Giants Cruise
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contacto" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Preguntarnos lo que quieras
              </Link>
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#f4623a] font-semibold hover:underline transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>
        </div>
      </div>
    </article>
  );
}