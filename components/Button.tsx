import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #ffff;
  font-size: 16px;
  &:hover {
    box-shadow: 0 0 20px #ddd;
  }
  &.green {
    background: #3eaf7c;
  }
  &.blue {
    background: #0170fe;
  }
  &.red {
    background: #ff0000;
  }
`;

export default Button;
