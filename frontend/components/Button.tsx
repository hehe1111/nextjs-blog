import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #24292e;
  border-radius: 4px;
  background-color: #fff;
  outline: none;
  font-size: 16px;
  transition: all 0.2s;
  &:hover {
    color: #fff;
    box-shadow: 0 0 20px #ddd;
    &.green {
      background-color: #3eaf7c;
      border-color: #3eaf7c;
    }
    &.blue {
      background-color: #0170fe;
      border-color: #0170fe;
    }
    &.red {
      background-color: #ff0000;
      border-color: #ff0000;
    }
  }
`;

export default Button;
