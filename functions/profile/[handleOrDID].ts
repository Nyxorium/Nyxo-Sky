import {Client} from '@atproto/lex'
import {app} from '#/lexicons'

import {html, renderHandleString} from './_shared'

type ProfileViewDetailed = app.bsky.actor.defs.ProfileViewDetailed

class HeadHandler {
  profile: ProfileViewDetailed
  url: string
  constructor(profile: ProfileViewDetailed, url: string) {
    this.profile = profile
    this.url = url
  }
  async element(element) {
    const view = this.profile

    const description = view.description
      ? html`
          <meta name="description" content="${view.description}" />
          <meta property="og:description" content="${view.description}" />
        `
      : ''
    const img = view.banner
      ? html`
          <meta property="og:image" content="${view.banner}" />
          <meta name="twitter:card" content="summary_large_image" />
        `
      : view.avatar
        ? html`<meta name="twitter:card" content="summary" />`
        : ''
    element.append(
      html`
        <meta property="og:site_name" content="Nyxo Sky" />
        <meta property="og:type" content="profile" />
        <meta property="profile:username" content="${view.handle}" />
        <meta property="og:url" content="${this.url}" />
        <meta property="og:title" content="${renderHandleString(view)}" />
        ${description} ${img}
        <meta name="twitter:label1" content="Account DID" />
        <meta name="twitter:value1" content="${view.did}" />
        <link
          rel="alternate"
          href="at://${view.did}/app.bsky.actor.profile/self" />
      `,
      {html: true},
    )
  }
}

class TitleHandler {
  profile: ProfileViewDetailed
  constructor(profile: ProfileViewDetailed) {
    this.profile = profile
  }
  async element(element) {
    element.setInnerContent(renderHandleString(this.profile))
  }
}

class NoscriptHandler {
  profile: ProfileViewDetailed
  constructor(profile: ProfileViewDetailed) {
    this.profile = profile
  }
  async element(element) {
    const view = this.profile

    element.append(
      html`
        <div id="bsky_profile_summary">
          <h3>Profile</h3>
          <p id="bsky_display_name">${view.displayName ?? ''}</p>
          <p id="bsky_handle">${view.handle}</p>
          <p id="bsky_did">${view.did}</p>
          <p id="bsky_profile_description">${view.description ?? ''}</p>
        </div>
      `,
      {html: true},
    )
  }
}

export async function onRequest(context) {
  const client = new Client({service: 'https://public.api.bsky.app/'})
  const {request, env} = context
  const origin = new URL(request.url).origin

  const base = env.ASSETS.fetch(new URL('/', origin))
  try {
    const profile = await client.call(app.bsky.actor.getProfile, {
      actor: context.params.handleOrDID,
    })
    return new HTMLRewriter()
      .on(`head`, new HeadHandler(profile, request.url))
      .on(`title`, new TitleHandler(profile))
      .on(`noscript`, new NoscriptHandler(profile))
      .transform(await base)
  } catch (e) {
    console.error(e)
    return await base
  }
}