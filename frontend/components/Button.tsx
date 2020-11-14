import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #ccc;
  color: #fff;
  font-size: 16px;
  &:hover {
    box-shadow: 0 0 20px #ddd;
  }
  &.green {
    background-color: #3eaf7c;
  }
  &.blue {
    background-color: #0170fe;
  }
  &.red {
    background-color: #ff0000;
  }
`;

export default Button;
