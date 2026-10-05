import styles from './PageHeader.module.css'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow && <p className={`${styles.eyebrow} animate-fade`}>{eyebrow}</p>}
      <h1 className={`${styles.title} animate-rise`}>{title}</h1>
      {subtitle && <p className={`${styles.subtitle} animate-rise`}>{subtitle}</p>}
    </header>
  )
}
