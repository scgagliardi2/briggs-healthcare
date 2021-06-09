{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="compare-items-hide-container" data-action="slide-toggle-compared-items" data-target=".compare-items-container">
	<span class="compare-items-title">{{translate 'Compare Products'}}</span>
    <i class="compare-items-container-hide-button transitions"><span>{{translate 'Hide'}}</span></i>
</div>
<div class="compare-items-container">
	{{#if products}}
		<div class="compare-items-products">
		{{#each products}}
			<div class="compare-item-wrapper">
                <div class="compare-item">
                  <button type="button" class="addedfromcomparison-remove-button" data-action="remove-from-add-to-compare" title="removefromaddtocompare"><i data-itemid="{{id}}" class="addedfromcomparison-remove-button-icon"></i></button>
                  <img class="addedfromcomparison-product-thumbnail" src="{{resizeImage url}}" alt="" itemprop="image" height="75" width="75" align="left" >
                  <p class="addedfromcomparison-product-name">{{name}}</p>
                </div>
			</div>
		{{/each}}
		</div>
    <div class="compare-item-buttons-container">
        <div class="addedfromcomparison-compare">
			<input type="button" class="addedfromcomparison-compare-button" data-action="proceed-to-compare-products" title="proceedtocompareproducts" value="{{translate 'Compare'}}">
        </div>
        <div class="addedfromcomparison-clear-all">
			<input type="button" class="addedfromcomparison-clear-all-button" data-action="clear-all-compare-products" data-dismiss="modal" title="clearallcompareproducts" value="{{translate 'Clear All'}}">
		</div>
    </div>
	{{/if}}
</div>
