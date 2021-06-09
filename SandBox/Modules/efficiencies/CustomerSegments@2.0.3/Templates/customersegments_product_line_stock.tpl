<div class="product-line-stock">
    {{#if isNotAvailableInStore}}
        {{#if showView}}
            <div class='product-line-stock-msg-not-available'>{{translate 'This item is no longer available'}}</div>
        {{/if}}
    {{else}}
        {{#if showOutOfStockMessage}}
            <p class="product-line-stock-msg-out">
				<span class="product-line-stock-icon-out">
					<i></i>
				</span>
                <span class="product-line-stock-msg-out-text">{{stockInfo.outOfStockMessage}}</span>
            </p>
        {{/if}}
        {{#if showInStockMessage}}
            <p class="product-line-stock-msg-in">
				<span class="product-line-stock-icon-in">
					<i></i>
				</span>
                {{stockInfo.inStockMessage}}
            </p>
        {{/if}}
    {{/if}}
</div>