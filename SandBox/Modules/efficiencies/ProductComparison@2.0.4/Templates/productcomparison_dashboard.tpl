<div class="productcomparison-container">
    <div id="productcompare-dashboard" class="productcompare-dashboard">
        <div class="productcompare-dashboard-header">
            <div class="productcompare-dashboard-title"><h1>{{translate 'Compare Products'}}</h1></div>
            <div class="productcompare-dashboard-buttons">
				<button type="button" class="productcomparison-button-share" data-action="share-productcomparison" title="shareproductcomparison">{{translate 'Share'}}</button>
				<a href="/search" class="productcomparison-button-back" title="Back to Search">{{translate 'Back to Search'}}</a>
            </div>
        </div>

        <table class="productcompare-dashboard-table">
            <tbody>
            {{#each itemProperties}}
                <tr class="{{#if rowclass }} {{ rowclass }} {{/if}}">
                    <td class="productcomparison-property-name">
                        {{#if label}}
                            {{label}}
                        {{else}}
                            &nbsp;
                        {{/if}}
                    </td>

                    {{#each productValues}}
                        <td class="
                                {{#if ../isTypeControlActions }}
                                    productcompare-dashboard-table-buttons
                                {{else}}
                                    productcomparison-property-value
                                {{/if}}
                            ">

                            {{#if ../isTypeImage }}
                                <img src="{{resizeImage this.url }}" alt="item thumbnail" class="productcomparison-thumb">
                            {{else}}
                                {{#if ../../isTypeControlActions }}
                                    <div>
                                        <a href="{{ this._url }}" class="productcomparison-button-view" title="{{translate 'View Product'}}">
                                            {{translate 'View'}}
                                        </a>
                                        <button data-itemid="{{ this.internalid }}" class="productcomparison-button-remove" data-toggle="show-in-modal" data-action="remove-from-productcomparison" title="removefromproductcomparison">
                                            {{translate 'Remove'}}
                                        </button>
                                    </div> <br/>
                                    <div class="productcomparison-property-value">
                                        <a href="{{ this._url }}" data-itemid="{{ this.internalid }}"  class="productcomparison-add" data-toggle="show-in-modal" data-action="add-to-cart" title="Add">
                                            <i class="icon-shopping-cart icon-white"></i>{{translate 'Add To Cart'}}
                                        </a>
                                    </div>
                                {{else}}
                                    {{ this }}
                                {{/if}}
                            {{/if}}
                        </td>
                    {{/each}}
                </tr>
            {{/each}}
            </tbody>
        </table>
    </div>
</div>
