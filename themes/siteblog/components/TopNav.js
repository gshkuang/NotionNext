import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Collapse from './Collapse'
import Logo from './Logo'
import MenuButtonGroup from './MenuButtonGroup'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import CONFIG_NEXT from '../config_next'
import SearchInput from './SearchInput'
let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = props => {
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const searchDrawer = useRef()

  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      if (scrollS >= windowTop && scrollS > 10) {
        const nav = document.querySelector('#sticky-nav')
        nav && nav.classList.replace('top-0', '-top-40')
        windowTop = scrollS
      } else {
        const nav = document.querySelector('#sticky-nav')
        nav && nav.classList.replace('-top-40', 'top-0')
        windowTop = scrollS
      }
    }, 200),
    []
  )

  // 监听滚动
  useEffect(() => {
    if (CONFIG_NEXT.NAV_TYPE === 'autoCollapse') {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    return () => {
      CONFIG_NEXT.NAV_TYPE === 'autoCollapse' &&
        window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className="mt-8">
          <div className="text-sm flex flex-nowrap justify-between font-light px-2">
            <div className="text-gray-600 dark:text-gray-200">
              <i className="mr-2 fas fa-th-list" />
              {locale.COMMON.CATEGORY}
            </div>
            <Link href={'/category'} passHref>
              <a className="mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer">
                {locale.COMMON.MORE} <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}

      {tags && (
        <section className="mt-4">
          <div className="text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
            <div className="text-gray-600 dark:text-gray-200">
              <i className="mr-2 fas fa-tag" />
              {locale.COMMON.TAGS}
            </div>
            <Link href={'/tag'} passHref>
              <a className="text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer">
                {locale.COMMON.MORE} <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          </div>
          <div className="p-2">
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  )

  return (
    <div id="top-nav" className={'sticky top-0 lg:relative w-full z-40 '}>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* 导航栏 */}
      <div
        id="sticky-nav"
        className={`${
          CONFIG_NEXT.NAV_TYPE !== 'normal' ? 'fixed' : ''
        } lg:relative w-full  shadow bg-white  top-0 z-20 transform duration-500`}
      >
        <div className="w-full flex justify-between justify-content space-between items-center p-4">
          {/* 左侧LOGO 标题 */}
          <div className="flex flex-none flex-grow-0">
            <div className="flex">
              <div onClick={toggleMenuOpen} className="w-8 cursor-pointer">
                {isOpen ? (
                  <i className="fas fa-times" />
                ) : (
                  <i className="fas fa-bars" />
                )}
              </div>
            </div>
            <Logo {...props} />
          </div>

          {/* 右侧功能 */}
          <div className="mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200">
            {/* <div
              className="cursor-pointer block"
              onClick={() => {
                searchDrawer?.current?.show()
              }}
            >
              <i className="mr-2 fas fa-search" />
              {locale.NAV.SEARCH}
            </div> */}
            {CONFIG_NEXT.MENU_SEARCH && (
              <div className="px-2 pt-2 font-sans">
                <SearchInput {...props} />
              </div>
            )}
          </div>
        </div>
        <Collapse type="vertical" isOpen={isOpen}>
          <div className="bg-white top-0">
            <MenuButtonGroup {...props} from="top" />
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default TopNav
