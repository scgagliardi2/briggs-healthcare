{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="home-nopad">
	<!-- CAROUSEL
    Use the Configuration section under Layout > Carousel images-->
	{{#if showCarousel}}
	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider class="home-image-slider-list">
				{{#each carousel}}
					<li>
					{{#unless text}}<a{{objectToAtrributes item}} class="home-slide-caption-button">{{/unless}}
						<div class="home-slide-main-container" style="background-image: url({{image}});">
							<img src="{{image}}" class="home-slide-image" style="display: none;">
							<div class="home-slide-caption">
								{{#if title}}<h2 class="home-slide-caption-title">{{title}}</h2>{{/if}}
								{{#if text}}<p>{{text}}</p>{{/if}}
								<div class="home-slide-caption-button-container">
									{{#if text}}
										<a{{objectToAtrributes item}} class="home-slide-caption-button">{{linktext}}<i class="home-slide-button-icon"></i></a>
									{{/if}}
								</div>
							</div>
						</div>
						{{#unless text}}</a>{{/unless}}
					</li>
				{{/each}}
			</ul>
		</div>
	</div>
	{{/if}}

</div>

<div class="home-nopad">
	<div class="home-cms-zone" data-cms-area="home_content_top" data-cms-area-filters="path"></div>

	<!-- CMS MERCHANDISING ZONE -->
	<div class="home-merchandizing-zone">
		<div class="home-merchandizing-zone-content">
			<div data-cms-area="home_merchandizing_zone" data-cms-area-filters="path"></div>
		</div>
	</div>

	<!--
    INFOBLOCKS
    Use the Configuration section under Layout > Infoblocks
	Two infoblocks per row
	-->
    <div class="home-infoblock-layout">
        {{#each infoblock}}
		<a href="{{href}}" class="home-infoblock-link">
			<div class="home-infoblock" style="{{#if image}}background-image: url({{image}}{{image}}); {{/if}}{{#if color}}background-color: {{color}};{{/if}}">
                <img src="{{../url}}{{image}}" class="home-infoblock-img">
				<div class="home-infoblock-content">
					{{#if title}}
		            <h2 class="home-infoblock-title">{{title}}</h2>
					{{/if}}
					{{#if text}}
		            <h3 class="home-infoblock-text">{{text}}</h3>
					{{/if}}
		        </div>
			</div>
		</a>
        {{/each}}
    </div>

	<div class="home-cms-zone" data-cms-area="home_content_middle" data-cms-area-filters="path"></div>
</div>

<div class="home">
	<!-- FREE TEXT AND IMAGES -->
	<div class="home-page-freetext-wrapper">
		<div class="home-page-freetext">

		    <div class="home-page-freetext-content">
		        <div class="home-page-freetext-content-text">
		        	{{#if freeTextTitle}}
					<div class="home-page-freetext-content-header">
				        <h3>{{freeTextTitle}}</h3>
				    </div>
				    {{/if}}
		        	<div data-view="FreeText"></div>
		        </div>
				{{#if showFreeTextImages}}
		        <div class="home-page-freetext-content-images-wrapper">
					{{#each freeTextImages}}
	                <div class="home-page-freetext-content-image"><a{{objectToAtrributes item}}><img src="{{../url}}{{image}}"></a></div>
					{{/each}}
		        </div>
		        {{/if}}
		    </div>
		</div>
	</div>
</div>

<div class="home-nopad">
    <div class="home-cms-zone" data-cms-area="home_content_bottom" data-cms-area-filters="path"></div>
</div>
