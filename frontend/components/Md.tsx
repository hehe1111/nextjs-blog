import marked from 'marked';
import hljs from 'highlight.js';
import { forwardRef } from 'react';
import styled from 'styled-components';

type IProps = {
  string: string;
  onScroll?: (event: UIEvent) => void;
  className?: string;
};

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

const Article = styled.article`
  @media (min-width: 700px) {
    &.markdown-body {
      font-size: 24px;
    }
  }
`;

// https://styled-components.com/docs/basics#styling-any-component
const Md = forwardRef(
  (
    { string, onScroll = () => {}, className = '' }: IProps,
    ref?: { current: HTMLElement }
  ) => {
    return (
      <Article
        ref={ref}
        dangerouslySetInnerHTML={{ __html: marked(string) }}
        className={`markdown-body ${className}`}
        // @ts-ignore
        onScroll={onScroll}
      ></Article>
    );
  }
);

export default Md;
