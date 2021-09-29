<div id="site-logo" class="content-banner"></div>

<a class="header-logo" href="{{headerLinkHref}}" data-touchpoint="{{headerLinkTouchPoint}}" data-hashtag="{{headerLinkHashtag}}" title="{{headerLinkTitle}}">

    {{#if logoUrl}}
        {{#if showThis}}
        <img class="header-logo-image" src="{{{logoUrl}}}" alt="{{siteName}}" style="max-height:{{minHeight}};">
        {{/if}}
    {{else}}
        <span class="header-logo-sitename">
            {{translate siteName}}
        </span>
    {{/if}}
</a>
