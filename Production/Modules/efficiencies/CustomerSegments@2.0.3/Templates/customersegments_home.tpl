<ul data-slider class="home-image-slider-list">
    {{#if isReady}}
        {{#if loadDefault}}
            {{#each carousel}}
                <li>
                    <div class="home-slide-main-container">
                        <img src="{{image}}" class="home-slide-image">
                        {{carouselBgrImg}}
                        <div class="home-slide-caption"
                             style="background-image: url({{../carouselBgrImg}});">
                            <div class="home-slide-caption-content">
                                {{#if title}}<h2 class="home-slide-caption-title">{{title}}</h2>{{/if}}
                                {{#if text}}<p>{{text}}</p>{{/if}}
                                <div class="home-slide-caption-button-container">
                                    <a{{objectToAtrributes item}} class="home-slide-caption-button">
                                        {{#if text}}
                                            {{#if linktext}}
                                                {{linktext}}
                                            {{else}}
                                                {{translate 'Shop now'}}
                                            {{/if}}
                                        {{else}}
                                            {{translate 'Shop now'}}
                                        {{/if}}
                                        <i class="home-slide-button-icon"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            {{/each}}
        {{else}}
            {{#each carousel}}
                <li>
                    <div class="home-slide-main-container">
                        <img src="{{resizeImage this ../imageHomeSize}}" alt="" />
                        <div class="home-slide-caption">
                            <h2 class="home-slide-caption-title">SAMPLE HEADLINE</h2>
                            <p>Example descriptive text displayed on multiple lines.</p>
                            <div class="home-slide-caption-button-container">
                                <a href="/search" class="home-slide-caption-button">Shop Now</a>
                            </div>
                        </div>
                    </div>
                </li>
            {{/each}}
        {{/if}}
    {{/if}}
</ul>