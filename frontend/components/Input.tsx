import styled from 'styled-components';

const Input = styled.input`
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid var(--black);
  border-radius: 4px;
  font-size: inherit;
  line-height: 2;
  outline: none;
  &:hover,
  &:focus {
    border-color: var(--blue);
  }
`;

export default Input;
