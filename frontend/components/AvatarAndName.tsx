import styled from 'styled-components';

const Image = styled.img`
  width: 1em;
  margin-right: 10px;
`;

export const Avatar = () => <Image src="/avatar.svg" alt="avatar" />;

export const AvatarAndName = styled.div`
  display: flex;
  align-items: center;
`;

export const Name = styled.span`
  color: var(--red);
`;
