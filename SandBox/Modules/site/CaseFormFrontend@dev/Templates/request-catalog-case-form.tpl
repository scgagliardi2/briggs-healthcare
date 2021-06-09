<section class="case-form-frontend case-form-frontend-contact-us">
    <h2>
        {{translate 'Request a Catalog'}}
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

                <div class="case-form-frontend-fields-group" data-input="title" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="title">
                        {{translate 'Title'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="title" name="title" value="{{lastname}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="address1" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="address1">
                        {{translate 'Address'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="address1" name="address1" value="{{address1}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="city" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="city">
                        {{translate 'City'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="city" name="city" value="{{city}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="state" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="state">
                        {{translate 'State'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <select class="case-form-frontend-fields-group-select" id="state" name="state">
                            <option value="" selected=""></option>
                            <option value="0">{{translate 'Alabama'}}</option>
                            <option value="1">{{translate 'Alaska'}}</option>
                            <option value="101">{{translate 'Alberta'}}</option>
                            <option value="2">{{translate 'Arizona'}}</option>
                            <option value="3">{{translate 'Arkansas'}}</option>
                            <option value="53">{{translate 'Armed Forces Americas'}}</option>
                            <option value="52">{{translate 'Armed Forces Europe'}}</option>
                            <option value="54">{{translate 'Armed Forces Pacific'}}</option>
                            <option value="102">{{translate 'British Columbia'}}</option>
                            <option value="4">{{translate 'California'}}</option>
                            <option value="5">{{translate 'Colorado'}}</option>
                            <option value="6">{{translate 'Connecticut'}}</option>
                            <option value="7">{{translate 'Delaware'}}</option>
                            <option value="8">{{translate 'District of Columbia'}}</option>
                            <option value="9">{{translate 'Florida'}}</option>
                            <option value="10">{{translate 'Georgia'}}</option>
                            <option value="11">{{translate 'Hawaii'}}</option>
                            <option value="12">{{translate 'Idaho'}}</option>
                            <option value="13">{{translate 'Illinois'}}</option>
                            <option value="14">{{translate 'Indiana'}}</option>
                            <option value="15">{{translate 'Iowa'}}</option>
                            <option value="16">{{translate 'Kansas'}}</option>
                            <option value="17">{{translate 'Kentucky'}}</option>
                            <option value="18">{{translate 'Louisiana'}}</option>
                            <option value="19">{{translate 'Maine'}}</option>
                            <option value="103">{{translate 'Manitoba'}}</option>
                            <option value="20">{{translate 'Maryland'}}</option>
                            <option value="21">{{translate 'Massachusetts'}}</option>
                            <option value="22">{{translate 'Michigan'}}</option>
                            <option value="23">{{translate 'Minnesota'}}</option>
                            <option value="24">{{translate 'Mississippi'}}</option>
                            <option value="25">{{translate 'Missouri'}}</option>
                            <option value="26">{{translate 'Montana'}}</option>
                            <option value="27">{{translate 'Nebraska'}}</option>
                            <option value="28">{{translate 'Nevada'}}</option>
                            <option value="104">{{translate 'New Brunswick'}}</option>
                            <option value="29">{{translate 'New Hampshire'}}</option>
                            <option value="30">{{translate 'New Jersey'}}</option>
                            <option value="31">{{translate 'New Mexico'}}</option>
                            <option value="32">{{translate 'New York'}}</option>
                            <option value="105">{{translate 'Newfoundland'}}</option>
                            <option value="33">{{translate 'North Carolina'}}</option>
                            <option value="34">{{translate 'North Dakota'}}</option>
                            <option value="107">{{translate 'Northwest Territories'}}</option>
                            <option value="106">{{translate 'Nova Scotia'}}</option>
                            <option value="108">{{translate 'Nunavut'}}</option>
                            <option value="35">{{translate 'Ohio'}}</option>
                            <option value="36">{{translate 'Oklahoma'}}</option>
                            <option value="109">{{translate 'Ontario'}}</option>
                            <option value="37">{{translate 'Oregon'}}</option>
                            <option value="38">{{translate 'Pennsylvania'}}</option>
                            <option value="110">{{translate 'Prince Edward Island'}}</option>
                            <option value="39">{{translate 'Puerto Rico'}}</option>
                            <option value="111">{{translate 'Quebec'}}</option>
                            <option value="40">{{translate 'Rhode Island'}}</option>
                            <option value="112">{{translate 'Saskatchewan'}}</option>
                            <option value="41">{{translate 'South Carolina'}}</option>
                            <option value="42">{{translate 'South Dakota'}}</option>
                            <option value="43">{{translate 'Tennessee'}}</option>
                            <option value="44">{{translate 'Texas'}}</option>
                            <option value="45">{{translate 'Utah'}}</option>
                            <option value="46">{{translate 'Vermont'}}</option>
                            <option value="47">{{translate 'Virginia'}}</option>
                            <option value="48">{{translate 'Washington'}}</option>
                            <option value="49">{{translate 'West Virginia'}}</option>
                            <option value="50">{{translate 'Wisconsin'}}</option>
                            <option value="51">{{translate 'Wyoming'}}</option>
                            <option value="113">{{translate 'Yukon'}}</option>
                        </select>
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="zipcode" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="zipcode">
                        {{translate 'Zip'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="text" class="case-form-frontend-fields-group-input" id="zipcode" name="zipcode" value="{{zipcode}}">
                    </div>
                </div>

                <div class="case-form-frontend-fields-group" data-input="incomingmessage" data-validation="control-group">
                    <label class="case-form-frontend-fields-group-label" for="incomingmessage">
                        {{translate 'Number of Catalogs (Max of 3)'}}
                        <span class="case-form-frontend-fields-group-label-required">*</span>
                    </label>
                    <div  class="case-form-frontend-fields-group-form-controls" data-validation="control">
                        <input type="number" class="case-form-frontend-fields-group-input" id="incomingmessage" name="incomingmessage" value="{{incomingmessage}}" min="1" max="3">
                    </div>
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