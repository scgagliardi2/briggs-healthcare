<section class="case-form-frontend case-form-frontend-contact-us">
    <h2>
        {{translate 'Contact Us'}}
    </h2>

    <form class="case-form-frontend" action="" method="POST">

        <fieldset>
            <div class="case-form-frontend-fields">

                <div data-type="alert-placeholder"></div>

                <small class="case-form-frontend-fields">
                    {{translate 'Required'}}
                    <span class="case-form-frontend-fields-required">*</span>
                </small>

                <div class="case-form-frontend-fields-group" data-input="firstname" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="firstname">
                        {{translate 'First Name'}} <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="firstname" name="firstname" value="{{firstname}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="lastname" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="lastname">
                        {{translate 'Last Name'}} <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="lastname" name="lastname" value="{{lastname}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="companyname" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="companyname">
                        {{translate 'Company'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="companyname" name="companyname" value="{{companyname}}" >
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="email" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="email">
                        {{translate 'Email'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="email" name="email" id="email" class="case-form-frontend-fields-group-input" />
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="title" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="title">
                        {{translate 'Title'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="title" name="title" value="{{lastname}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group"  data-input="phone" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="phone">
                        {{translate 'Phone'}}
                        <span class="case-form-frontend-fields-input-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="tel" class="case-form-frontend-fields-group-input" id="phone" name="phone" value="{{phone}}" data-action="inputphone">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="incomingmessage" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="incomingmessage">
                        {{translate 'Comments'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
					<span class="case-form-frontend-fields-group-form-controls" data-validation="control">
						<textarea name="incomingmessage" id="incomingmessage" class="case-form-frontend-fields-group-textarea" rows="4"></textarea>
					</span>
                </div>

            </div>
        </fieldset>

        <div class="case-form-frontend-actions">
            <button type="submit" class="case-form-frontend-button-submit">
                {{translate 'Submit'}}
            </button>
        </div>
    </form>
</section>