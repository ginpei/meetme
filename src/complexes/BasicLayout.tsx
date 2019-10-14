import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import firebase from '../middleware/firebase';
import { useUser } from '../models/users';

const BasicHeaderOuter = styled.div`
  background-color: var(--color-theme-bg);
  color: var(--color-theme-fg);
  font-size: 0.8rem;
  line-height: 1.8em;

  & a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BasicHeaderInner = styled.div.attrs({
  className: 'ui-container',
})`
  display: flex;
  justify-content: space-between;
`;

const UserImageOuter = styled.i`
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 0.1em;
  display: inline-block;
  height: 1.1em;
  margin-right: 0.5em;
  vertical-align: sub;
  width: 1.1em;
`;

const UserImage: FC<{ src: string }> = (props) => (
  <UserImageOuter
    style={{
      backgroundImage: `url("${props.src}")`,
    }}
  />
);

const BasicBody = styled.div.attrs({
  className: 'ui-container',
})`
  min-height: 50vh;
`;

const BasicFooter = styled.div`
  border-top: dashed 1px #ccc;
  font-size: 0.8rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
`;

type Prop = React.ComponentPropsWithRef<'div'>;

const BasicLayout: FC<Prop> = (props) => {
  const [user, userInitialized] = useUser(firebase.auth());
  
  return (
    <div {...props} className={`BasicLayout ${props.className}`}>
      <BasicHeaderOuter>
        <BasicHeaderInner>
          <span>
            <Link to="/" aria-label="Home">Meet Me</Link>
          </span>
          <span>
            {userInitialized && (
              user ? (
                <Link to="/logout">
                  <UserImage src={user.imageUrl} />
                  {user.name}
                </Link>
              ) : (
                <Link to="/login">Login</Link>
              )
            )}
          </span>
        </BasicHeaderInner>
      </BasicHeaderOuter>
      <BasicBody>
        {props.children}
      </BasicBody>
      <BasicFooter>
        <div className="ui-container">
          {'By '}
          <a href="https://ginpei.dev">Ginpei Takanashi</a>
        </div>
      </BasicFooter>
    </div>
  );
};

export default BasicLayout;
