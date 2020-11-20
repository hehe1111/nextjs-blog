import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid var(--black);
  border-radius: 4px;
  background-color: var(--white);
  outline: none;
  font-size: 16px;
  transition: all 0.2s;
  &:hover {
    color: var(--white);
    box-shadow: 0 0 20px var(--grey);
    &.green {
      background-color: var(--green);
      border-color: var(--green);
    }
    &.blue {
      background-color: var(--blue);
      border-color: var(--blue);
    }
    &.red {
      background-color: var(--red);
      border-color: var(--red);
    }
  }
`;

export default Button;
