import React, { useEffect, useRef } from 'react';

interface GiscusProps {
  repo?: string;
  repoId?: string;
  categoryId?: string;
  theme?: string;
}

const GiscusComments: React.FC<GiscusProps> = ({
  repo = "Haluntech/pathwordle",
  repoId = "R_kgDOJxxxxxxxx", // Replace with your actual repo-id from giscus.app
  categoryId = "DIC_kwDOJxxxxxxxx", // Replace with your actual category-id from giscus.app
  theme = "dark_dimmed"
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove existing script if any
    const existingScript = document.querySelector('#giscus-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    script.id = 'giscus-script';
    
    if (ref.current) {
      ref.current.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [repo, repoId, categoryId, theme]);

  return (
    <div 
      ref={ref} 
      className="giscus-container"
      style={{ minHeight: '200px' }}
    />
  );
};

export default GiscusComments;
