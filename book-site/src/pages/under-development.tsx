import React from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';

function UnderDevelopment() {
  const history = useHistory();

  const handleGoBack = () => {
    history.push('/');
  };

  return (
    <Layout
      title="Under Development"
      description="This feature is currently under development.">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">Feature Under Development</h1>
            <p>
              This feature is currently in development mode. We are working hard to bring it to you soon!
              In the future, it will be fully ready.
            </p>
            <button className="button button--primary" onClick={handleGoBack}>
              Go back to Home
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default UnderDevelopment;
