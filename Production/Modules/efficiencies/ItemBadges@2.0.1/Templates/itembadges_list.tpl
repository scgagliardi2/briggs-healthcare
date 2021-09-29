<div>
<div class="itembadges-image-row {{#if showIcon}}itembadges-show{{/if}}">
    <img class="itembadges-cell-image"
        {{#with icon}}​
        src="{{resizeImage name 'thumbnail'}}"
        data-id="{{internalid}}"
        data-name="{{name}}"
        {{/with}}
        {{#if alt.length}}​
        alt="{{alt}}"
        {{else}}
        alt="{{name}}"
        {{/if}}
        itemprop="image">
</div>
<div class="itembadges-badge-row {{#if showText}}itembadges-show{{/if}}" style="background:#{{bgcolor}}">
    <div class="itembadges-badge">
        {{name}}
    </div>
</div>
</div>