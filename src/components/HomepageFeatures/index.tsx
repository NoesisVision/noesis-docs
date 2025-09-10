import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Set-up',
    Svg: () => (
      <div style={{
        width: '160px',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: '#475569',
        fontSize: '48px',
        margin: '0 auto'
      }}>
        ⚙️
      </div>
    ),
    description: (
      <>
        Deploy Noesis on your infrastructure to safely scan your projects and 
        describe their elements using the LLM of your choice.
      </>
    ),
  },
  {
    title: 'Configure',
    Svg: () => (
      <div style={{
        width: '160px',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: '#475569',
        fontSize: '48px',
        margin: '0 auto'
      }}>
        🔧
      </div>
    ),
    description: (
      <>
        Learn how to use Noesis DSL to set architectural patterns of your code, 
        allowing Noesis to focus on key building blocks in your codebase.
      </>
    ),
  },
  {
    title: 'Explore',
    Svg: () => (
      <div style={{
        width: '160px',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        color: '#475569',
        fontSize: '48px',
        margin: '0 auto'
      }}>
        🔍
      </div>
    ),
    description: (
      <>
        Check out how to use Noesis UI and generate static documentation pages 
        to explore and understand your code architecture.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  const getDocLink = (title: string) => {
    switch (title) {
      case 'Set-up': return '/docs/setup';
      case 'Configure': return '/docs/configure';
      case 'Explore': return '/docs/explore';
      default: return '/docs/intro';
    }
  };

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{ paddingBottom: '2rem' }}>
        <Link to={getDocLink(title)}>
          <Svg className={styles.featureSvg} role="img" />
        </Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">
          <Link to={getDocLink(title)} style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </Link>
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
