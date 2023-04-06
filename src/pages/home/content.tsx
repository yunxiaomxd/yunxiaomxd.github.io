import classNames from 'classnames';
import styles from './styles.module.scss';

interface IRecentArticle {
  title: string;
  time: string;
  link: string;
  id: string;
}

interface IContent {
  recentArticles: IRecentArticle[];
}

export default function Content(props: IContent) {
  const { recentArticles } = props;

  return (
    <>
      <div className="h-[80px]" />
      <div className={styles.content}>
        <h6 className={classNames('text-[24px]', 'font-mono')}>最近发布</h6>
        {
          recentArticles.length === 0 ? (
            <div className={styles.empty}>
              暂无发布内容
            </div>
          ) :
          recentArticles.map((v) => (
            <div className={styles.recentArticleItem}>
              <span>{v.title}</span>
              <span>{v.time}</span>
            </div>
          ))
        }
        {
          recentArticles.length > 10 && <div>查看全部文章</div>
        }
      </div>
      <div className={styles.folder}>
        
      </div>
    </>
  )
}