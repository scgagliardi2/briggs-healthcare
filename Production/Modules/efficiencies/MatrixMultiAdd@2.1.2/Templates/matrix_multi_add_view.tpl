{{#if showGrid}}
    {{#if ismatrixdimension}}
    	<section class="matrix-multi-add">
            <!-- Using two tables here is not the preferred way of building the grid, however,
            the child template must have a unique tag as the wrapper tag, which leaves only thead
            and tbody in table syntax, so they have to go in the child templates -->
        	<div class="matrix-multi-add-table-wrapper">
                {{#if colsOnly}}
                    <h3 class="matrix-multi-add-table-cols-title" data-section="matrix-multi-add-header">{{translate 'Order Sheet'}}</h3>
                    <div data-section="matrix-multi-add-table">
                        <table class="matrix-multi-add-cols-table" data-view="MatrixMultiAdd.Row"></table>
                    </div>
                {{else}}
                    <table class="matrix-multi-add-table-head" data-section="matrix-multi-add-header" data-view="MatrixMultiAdd.RowHead"></table>
                    <div data-section="matrix-multi-add-table">
                        <table class="matrix-multi-add-table" data-view="MatrixMultiAdd.Row"></table>
                    </div>
                {{/if}}
            </div>

            <div class="matrix-multi-add-footer" data-section="matrix-multi-add-footer">
                <div class="matrix-multi-add-footer-error" id="mmaerror">
                    <div class="item-error"></div>
                    <section class="matrix-stockinfo"></section>
                </div>
                <div class="matrix-multi-add-footer-action">
                    <div class="cart-error"></div>
                    <div class="matrix-multi-add-footer-subtotal"><span>{{translate 'Subtotal'}} </span><span class="grandtotal">{{total}}</span></div>
                    <button data-action="add-to-cart" class="matrix-multi-add-button">{{translate 'Add to Cart'}} </button>
                </div>
            </div>
    	</section>
    {{/if}}
{{/if}}