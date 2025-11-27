import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = {
  postsProfileTab: persisted.Schema['disablePostsProfileTab']
  repliesProfileTab: persisted.Schema['disableRepliesProfileTab']
  mediaProfileTab: persisted.Schema['disableMediaProfileTab']
  videosProfileTab: persisted.Schema['disableVideosProfileTab']
  feedsProfileTab: persisted.Schema['disableFeedsProfileTab']
  starterPacksProfileTab: persisted.Schema['disableStarterPacksProfileTab']
  listsProfileTab: persisted.Schema['disableListsProfileTab']

  postsProfileTab_self: persisted.Schema['disablePostsProfileTab_self']
  repliesProfileTab_self: persisted.Schema['disableRepliesProfileTab_self']
  mediaProfileTab_self: persisted.Schema['disableMediaProfileTab_self']
  videosProfileTab_self: persisted.Schema['disableVideosProfileTab_self']
  likesProfileTab_self: persisted.Schema['disableLikesProfileTab_self']
  feedsProfileTab_self: persisted.Schema['disableFeedsProfileTab_self']
  starterPacksProfileTab_self: persisted.Schema['disableStarterPacksProfileTab_self']
  listsProfileTab_self: persisted.Schema['disableListsProfileTab_self']
}
type SetContext = {
  setPostsProfileTab: (v: persisted.Schema['disablePostsProfileTab']) => void
  setRepliesProfileTab: (v: persisted.Schema['disableRepliesProfileTab']) => void
  setMediaProfileTab: (v: persisted.Schema['disableMediaProfileTab']) => void
  setVideosProfileTab: (v: persisted.Schema['disableVideosProfileTab']) => void
  setFeedsProfileTab: (v: persisted.Schema['disableFeedsProfileTab']) => void
  setStarterPacksProfileTab: (v: persisted.Schema['disableStarterPacksProfileTab']) => void
  setListsProfileTab: (v: persisted.Schema['disableListsProfileTab']) => void

  setPostsProfileTab_self: (v: persisted.Schema['disablePostsProfileTab_self']) => void
  setRepliesProfileTab_self: (v: persisted.Schema['disableRepliesProfileTab_self']) => void
  setMediaProfileTab_self: (v: persisted.Schema['disableMediaProfileTab_self']) => void
  setVideosProfileTab_self: (v: persisted.Schema['disableVideosProfileTab_self']) => void
  setLikesProfileTab_self: (v: persisted.Schema['disableLikesProfileTab_self']) => void
  setFeedsProfileTab_self: (v: persisted.Schema['disableFeedsProfileTab_self']) => void
  setStarterPacksProfileTab_self: (v: persisted.Schema['disableStarterPacksProfileTab_self']) => void
  setListsProfileTab_self: (v: persisted.Schema['disableListsProfileTab_self']) => void

}

const stateContext = React.createContext<StateContext>({
  postsProfileTab: true,
  repliesProfileTab: true,
  mediaProfileTab: true,
  videosProfileTab: true,
  feedsProfileTab: true,
  starterPacksProfileTab: true,
  listsProfileTab: true,

  postsProfileTab_self: true,
  repliesProfileTab_self: true,
  mediaProfileTab_self: true,
  videosProfileTab_self: true,
  likesProfileTab_self: true,
  feedsProfileTab_self: true,
  starterPacksProfileTab_self: true,
  listsProfileTab_self: true,

})
stateContext.displayName = 'MetricStateContext'
const setContext = React.createContext<SetContext>({} as SetContext)
setContext.displayName = 'MetricSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [postsProfileTab, setPostsProfileTab] = React.useState(
    persisted.get('disablePostsProfileTab'),
  )
  const [repliesProfileTab, setRepliesProfileTab] = React.useState(
    persisted.get('disableRepliesProfileTab'),
  )
  const [mediaProfileTab, setMediaProfileTab] = React.useState(
    persisted.get('disableMediaProfileTab'),
  )
  const [videosProfileTab, setVideosProfileTab] = React.useState(
    persisted.get('disableVideosProfileTab'),
  )
  const [feedsProfileTab, setFeedsProfileTab] = React.useState(
    persisted.get('disableFeedsProfileTab'),
  )
  const [starterPacksProfileTab, setStarterPacksProfileTab] = React.useState(
    persisted.get('disableStarterPacksProfileTab'),
  )
  const [listsProfileTab, setListsProfileTab] = React.useState(
    persisted.get('disableListsProfileTab'),
  )

  const [postsProfileTab_self, setPostsProfileTab_self] = React.useState(
    persisted.get('disablePostsProfileTab_self'),
  )
  const [repliesProfileTab_self, setRepliesProfileTab_self] = React.useState(
    persisted.get('disableRepliesProfileTab_self'),
  )
  const [mediaProfileTab_self, setMediaProfileTab_self] = React.useState(
    persisted.get('disableMediaProfileTab_self'),
  )
  const [videosProfileTab_self, setVideosProfileTab_self] = React.useState(
    persisted.get('disableVideosProfileTab_self'),
  )
  const [likesProfileTab_self, setLikesProfileTab_self] = React.useState(
    persisted.get('disableLikesProfileTab_self'),
  )
  const [feedsProfileTab_self, setFeedsProfileTab_self] = React.useState(
    persisted.get('disableFeedsProfileTab_self'),
  )
  const [starterPacksProfileTab_self, setStarterPacksProfileTab_self] = React.useState(
    persisted.get('disableStarterPacksProfileTab_self'),
  )
  const [listsProfileTab_self, setListsProfileTab_self] = React.useState(
    persisted.get('disableListsProfileTab_self'),
  )

  const stateContextValue = React.useMemo(
    () => ({
      postsProfileTab,
      repliesProfileTab,
      mediaProfileTab,
      videosProfileTab,
      feedsProfileTab,
      starterPacksProfileTab,
      listsProfileTab,
      postsProfileTab_self,
      repliesProfileTab_self,
      mediaProfileTab_self,
      videosProfileTab_self,
      likesProfileTab_self,
      feedsProfileTab_self,
      starterPacksProfileTab_self,
      listsProfileTab_self,
    }),
    [
      postsProfileTab, 
      repliesProfileTab, 
      mediaProfileTab, 
      videosProfileTab, 
      feedsProfileTab, 
      starterPacksProfileTab, 
      listsProfileTab,

      postsProfileTab_self, 
      repliesProfileTab_self, 
      mediaProfileTab_self, 
      videosProfileTab_self, 
      likesProfileTab_self, 
      feedsProfileTab_self, 
      starterPacksProfileTab_self, 
      listsProfileTab_self
    ],
  )

  const setContextValue = React.useMemo(
    () => ({
      setPostsProfileTab: (
        _postsProfileTab: persisted.Schema['disablePostsProfileTab'],
      ) => {
        setPostsProfileTab(_postsProfileTab)
        persisted.write('disablePostsProfileTab', _postsProfileTab)
      },

      setRepliesProfileTab: (
        _repliesProfileTab: persisted.Schema['disableRepliesProfileTab'],
      ) => {
        setRepliesProfileTab(_repliesProfileTab)
        persisted.write('disableRepliesProfileTab', _repliesProfileTab)
      },

      setMediaProfileTab: (
        _mediaProfileTab: persisted.Schema['disableMediaProfileTab'],
      ) => {
        setMediaProfileTab(_mediaProfileTab)
        persisted.write('disableMediaProfileTab', _mediaProfileTab)
      },

      setVideosProfileTab: (
        _videosProfileTab: persisted.Schema['disableVideosProfileTab'],
      ) => {
        setVideosProfileTab(_videosProfileTab)
        persisted.write('disableVideosProfileTab', _videosProfileTab)
      },

      setFeedsProfileTab: (
        _feedsProfileTab: persisted.Schema['disableFeedsProfileTab'],
      ) => {
        setFeedsProfileTab(_feedsProfileTab)
        persisted.write('disableFeedsProfileTab', _feedsProfileTab)
      },

      setStarterPacksProfileTab: (
        _starterPacksProfileTab: persisted.Schema['disableStarterPacksProfileTab'],
      ) => {
        setStarterPacksProfileTab(_starterPacksProfileTab)
        persisted.write('disableStarterPacksProfileTab', _starterPacksProfileTab)
      },

      setListsProfileTab: (
        _listsProfileTab: persisted.Schema['disableListsProfileTab'],
      ) => {
        setListsProfileTab(_listsProfileTab)
        persisted.write('disableListsProfileTab', _listsProfileTab)
      },

      setPostsProfileTab_self: (
        _postsProfileTab_self: persisted.Schema['disablePostsProfileTab_self'],
      ) => {
        setPostsProfileTab_self(_postsProfileTab_self)
        persisted.write('disablePostsProfileTab_self', _postsProfileTab_self)
      },

      setRepliesProfileTab_self: (
        _repliesProfileTab_self: persisted.Schema['disableRepliesProfileTab_self'],
      ) => {
        setRepliesProfileTab_self(_repliesProfileTab_self)
        persisted.write('disableRepliesProfileTab_self', _repliesProfileTab_self)
      },

      setMediaProfileTab_self: (
        _mediaProfileTab_self: persisted.Schema['disableMediaProfileTab_self'],
      ) => {
        setMediaProfileTab_self(_mediaProfileTab_self)
        persisted.write('disableMediaProfileTab_self', _mediaProfileTab_self)
      },

      setVideosProfileTab_self: (
        _videosProfileTab_self: persisted.Schema['disableVideosProfileTab_self'],
      ) => {
        setVideosProfileTab_self(_videosProfileTab_self)
        persisted.write('disableVideosProfileTab_self', _videosProfileTab_self)
      },

      setLikesProfileTab_self: (
        _likesProfileTab_self: persisted.Schema['disableLikesProfileTab_self'],
      ) => {
        setLikesProfileTab_self(_likesProfileTab_self)
        persisted.write('disableLikesProfileTab_self', _likesProfileTab_self)
      },

      setFeedsProfileTab_self: (
        _feedsProfileTab_self: persisted.Schema['disableFeedsProfileTab_self'],
      ) => {
        setFeedsProfileTab_self(_feedsProfileTab_self)
        persisted.write('disableFeedsProfileTab_self', _feedsProfileTab_self)
      },

      setStarterPacksProfileTab_self: (
        _starterPacksProfileTab_self: persisted.Schema['disableStarterPacksProfileTab_self'],
      ) => {
        setStarterPacksProfileTab_self(_starterPacksProfileTab_self)
        persisted.write('disableStarterPacksProfileTab_self', _starterPacksProfileTab_self)
      },

      setListsProfileTab_self: (
        _listsProfileTab_self: persisted.Schema['disableListsProfileTab_self'],
      ) => {
        setListsProfileTab_self(_listsProfileTab_self)
        persisted.write('disableListsProfileTab_self', _listsProfileTab_self)
      },

    }),
    [],
  )

  React.useEffect(() => {
    const unsub1 = persisted.onUpdate(
      'disablePostsProfileTab', 
      nextPostsProfileTab => {
        setPostsProfileTab(nextPostsProfileTab)
      },
    )

    const unsub2 = persisted.onUpdate(
      'disableRepliesProfileTab',
      nextRepliesProfileTab => {
        setRepliesProfileTab(nextRepliesProfileTab)
      },
    )

    const unsub3 = persisted.onUpdate(
      'disableMediaProfileTab',
      nextMediaProfileTab => {
        setMediaProfileTab(nextMediaProfileTab)
      },
    )

    const unsub4 = persisted.onUpdate(
      'disableVideosProfileTab',
      nextVideosProfileTab => {
        setVideosProfileTab(nextVideosProfileTab)
      },
    )

    const unsub5 = persisted.onUpdate(
      'disableFeedsProfileTab',
      nextFeedsProfileTab => {
        setFeedsProfileTab(nextFeedsProfileTab)
      },
    )

    const unsub6 = persisted.onUpdate(
      'disableStarterPacksProfileTab',
      nextStarterPacksProfileTab => {
        setStarterPacksProfileTab(nextStarterPacksProfileTab)
      },
    )

    const unsub7 = persisted.onUpdate(
      'disableListsProfileTab',
      nextListsProfileTab => {
        setListsProfileTab(nextListsProfileTab)
      },
    )

    const unsub8 = persisted.onUpdate(
      'disablePostsProfileTab_self', 
      nextPostsProfileTab_self => {
        setPostsProfileTab_self(nextPostsProfileTab_self)
      },
    )

    const unsub9 = persisted.onUpdate(
      'disableRepliesProfileTab_self',
      nextRepliesProfileTab_self => {
        setRepliesProfileTab_self(nextRepliesProfileTab_self)
      },
    )

    const unsub10 = persisted.onUpdate(
      'disableMediaProfileTab_self',
      nextMediaProfileTab_self => {
        setMediaProfileTab_self(nextMediaProfileTab_self)
      },
    )

    const unsub11 = persisted.onUpdate(
      'disableVideosProfileTab_self',
      nextVideosProfileTab_self => {
        setVideosProfileTab_self(nextVideosProfileTab_self)
      },
    )

    const unsub12 = persisted.onUpdate(
      'disableLikesProfileTab_self',
      nextLikesProfileTab_self => {
        setLikesProfileTab_self(nextLikesProfileTab_self)
      },
    )

    const unsub13 = persisted.onUpdate(
      'disableFeedsProfileTab_self',
      nextFeedsProfileTab_self => {
        setFeedsProfileTab_self(nextFeedsProfileTab_self)
      },
    )

    const unsub14 = persisted.onUpdate(
      'disableStarterPacksProfileTab_self',
      nextStarterPacksProfileTab_self => {
        setStarterPacksProfileTab_self(nextStarterPacksProfileTab_self)
      },
    )

    const unsub15 = persisted.onUpdate(
      'disableListsProfileTab_self',
      nextListsProfileTab_self => {
        setListsProfileTab_self(nextListsProfileTab_self)
      },
    )

    return () => {
      unsub1()
      unsub2()
      unsub3()
      unsub4()
      unsub5()
      unsub6()
      unsub7()
      unsub8()
      unsub9()
      unsub10()
      unsub11()
      unsub12()
      unsub13()
      unsub14()
      unsub15()
    }
  }, [])

  return (
    <stateContext.Provider value={stateContextValue}>
      <setContext.Provider value={setContextValue}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useProfileTabVisibilityPref() {
  return React.useContext(stateContext)
}

export function useSetProfileTabVisibilityPref() {
  return React.useContext(setContext)
}