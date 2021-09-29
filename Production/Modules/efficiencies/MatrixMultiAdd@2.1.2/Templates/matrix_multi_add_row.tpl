<tbody class="matrix-multi-add-table-body">
    {{#if isDisplay}}
    <tr data-rowid="{{uniqueID}}" class="matrix-multi-add-row" data-action="mma-show-prices">
        <td class="matrix-multi-add-first-cell">
            {{#if thumbnailImage.url}}
                <img class="matrix-multi-add-thumb-image" src="{{thumbnailImage.url}}" alt="{{colsLabel}}">
            {{else}}
                {{#if cols}}<div class="matrix-multi-add-thumb-color" style="background-color: {{cols}}"></div>{{/if}}
            {{/if}}
            <span class="matrix-multi-add-cols-label">{{colsLabel}}</span>
        </td>
        {{#if rowsCollection}}
            {{#each rowsCollection}}
                {{#if internalid}}
                    {{#if isAvailable}}
                        <td class="matrix-multi-add-quantity">
                            <input data-field="input" type="number" name="{{label}}" min="0" class="multi-add-to-cart-quantity-value" data-rowid="{{internalid}}" placeholder="0" data-action="add-quantity" value="{{quantity}}">
                        </td>
                    {{else}}
                        <td class="matrix-multi-add-not-available">{{translate 'N/A'}}</td>
                    {{/if}}
                {{/if}}
            {{/each}}
        {{else}}
            {{#if uniqueID}}
                {{#if colsCollection.isAvailable}}
                    <td class="matrix-multi-add-quantity">
                        <input data-field="input" type="number" name="{{colsCollection.label}}" min="0" class="multi-add-to-cart-quantity-value" placeholder="0" data-action="add-quantity" value="{{colsCollection.quantity}}">
                    </td>
                {{else}}
                    <td class="matrix-multi-add-not-available">{{translate 'N/A'}}</td>
                {{/if}}
                    <td class="matrix-multi-add-spacer">&nbsp;</td>
            {{/if}}
        {{/if}}
        <td class="matrix-multi-add-first-cell">
            <a href="#" data-action="mma-moredetails" class="matrix-multi-add-details">More Details</a>
        </td>
    </tr>
    <tr data-priceid="{{uniqueID}}" class="matrix-multi-add-pricing matrix-multi-add-collapse">
        {{#if isRows}}
            <!-- Alignemnt Fix if it has columns only -->
            <td></td>
        {{/if}}
        {{#each priceCollection}}
            <td>
                {{#if priceSchedule}}
                    <table align="center">
                        <tbody>
                            <tr>
                                <td class="quantity-pricing-table-header">{{translate 'Available'}}</td>
                                <td class="quantity-pricing-table-body">
                                    {{qytAvailable}}
                                </td>
                            </tr>
                            <tr>
                                <td class="quantity-pricing-table-header">{{translate 'Quantity'}}</td>
                                <td class="quantity-pricing-table-header">{{translate 'Price'}}</td>
                            </tr>
                            {{#each priceSchedule}}
                                <tr>
                                    {{#if maximumquantity}}
                                        <td class="quantity-pricing-table-body">{{minimumquantity}} – {{maximumquantity}}</td>
                                        {{#if is_range}}
                                            <td class="quantity-pricing-table-body">{{price_range.min_formatted}} - {{price_range.max_formatted}}</td>
                                        {{else}}
                                            <td class="quantity-pricing-table-body">{{price_formatted}}</td>
                                        {{/if}}
                                    {{else}}
                                        <td class="quantity-pricing-table-body">{{minimumquantity}} +</td>
                                        {{#if is_range}}
                                            <td class="quantity-pricing-table-body">{{price_range.min_formatted}} - {{price_range.max_formatted}}</td>
                                        {{else}}
                                            <td class="quantity-pricing-table-body">{{price_formatted}}</td>
                                        {{/if}}
                                    {{/if}}
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                {{else}}
                    {{#if originalPrice}}
                        <table align="center">
                            <tbody>
                                <tr>
                                    <td class="quantity-pricing-table-header">{{translate 'Available'}}</td>
                                    <td class="quantity-pricing-table-body">
                                        {{qytAvailable}}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="quantity-pricing-table-header">{{translate 'Price'}}</td>
                                    <td class="quantity-pricing-table-body">
                                        {{originalPrice}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    {{/if}}
                {{/if}}
            </td>
        {{/each}}
    </tr>

    {{else}}
    <!-- weird bug fix: prevents an empty div from being inserted into the HTML -->
    <tr style="display:none;"><td></td></tr>
    {{/if}}
</tbody>