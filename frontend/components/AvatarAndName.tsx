import styled from 'styled-components';
import avatar from 'assets/images/avatar.svg';

const Image = styled.img`
  width: 1em;
  margin-right: 10px;
`;

export const Avatar = (): JSX.Element => <Image src={avatar} alt="avatar" />;

export const AvatarAndName = styled.div`
  display: flex;
  align-items: center;
`;

export const Name = styled.span`
  color: var(--red);
`;
