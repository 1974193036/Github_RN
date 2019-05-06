import {onFlushPopularFavorite, onLoadMorePopular, onRefreshPopular} from './popular';
import {onFlushTrendingFavorite, onLoadMoreTrending, onRefreshTrending} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';
import {onShowCustomThemeView, onThemeChange, onThemeInit} from './theme';

export default {
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView
}