import marked from 'marked';
import hljs from 'highlight.js';
import { forwardRef } from 'react';

// https://marked.js.org/using_advanced
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, language) => {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

// https://styled-components.com/docs/basics#styling-any-component
const Md = forwardRef(
  (
    {
      string,
      onScroll = () => {},
      className = '',
    }: {
      string: string;
      onScroll?: (event: UIEvent) => void;
      className?: string;
    },
    ref?: { current: HTMLElement }
  ) => {
    return (
      <article
        ref={ref}
        dangerouslySetInnerHTML={{ __html: marked(string) }}
        className={`markdown-body ${className}`}
        // @ts-ignore
        onScroll={onScroll}
      ></article>
    );
  }
);

export default Md;
