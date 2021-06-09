{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<section class="case-detail">
	<header class="case-detail-title">
		<a href="/cases" class="case-detail-back-btn">{{translate '&lt; Back to Cases'}}</a>
		<h2 class="case-detail-header-title">
			<span class="case-detail-field-number">{{pageHeader}}</span>
			<span class="case-detail-field-subject"> {{model.title}}</span>
		</h2>
	</header>

	<div data-confirm-message class="case-detail-confirm-message"></div>

	<div data-type="alert-placeholder"></div>

	<div class="case-detail-header-information">
		<div class="case-detail-header-row">
			<div class="case-detail-header-col-left">
				<p>{{translate '<span class="case-detail-label-type">Type of inquiry: </span> <span class="case-detail-value-type">$(0)</span>' model.category.name}}</p>
				<p>{{translate '<span class="case-detail-label-creation-date">Creation date: </span> <span class="case-detail-value-creation-date">$(0)</span>' model.createdDate}}</p>
				<p>{{translate '<span class="case-detail-label-last-message-date">Last message: </span> <span class="case-detail-value-last-message-date">$(0)</span>' model.lastMessageDate}}</p>
			</div>
			<div class="case-detail-header-col-right">
				<p class="case-detail-header-status-info">{{translate '<span class="case-detail-label-status">Status: </span> <span class="case-detail-value-status">$(0)</span>' model.status.name}}</p>
				{{#if closeStatusId}}
					<div class="case-detail-reply-section">
						<button type="button" class="case-detail-close-case-button" data-action="close-case">{{translate 'Close Case'}}</button>
					</div>
				{{/if}}
			</div>
		</div>
	</div>

	<div class="case-detail-conversation-background">
		<form action="#">
				<div class="case-detail-reply-container" data-validation="control-group">
					<label class="case-detail-reply-label" for="reply">{{translate 'Reply with a message:'}}</label>
					<span class="case-detail-controls" data-validation="control">
						<textarea name="reply" id="reply" class="case-detail-reply-textarea" rows="4"></textarea>
					</span>
				</div>
				<div class="case-detail-reply-section">
					<button type="submit" class="case-detail-reply-button">{{translate 'Reply'}}</button>
				</div>
		</form>

		<div class="case-detail-messages-accordion">
			<div class="case-detail-accordion-head">
				<a class="case-detail-accordion-head-toggle" data-toggle="collapse" data-target="#response-messages" aria-expanded="true" aria-controls="response-messages" id="caseCount">
					{{translate 'Messages ($(0))' model.messages_count}}
					<i class="case-detail-accordion-toggle-icon"></i>
				</a>
			</div>
			<div class="case-detail-accordion-body collapse in" id="response-messages" role="tabpanel" data-target="#response-messages">
				<div class="case-detail-accordion-container">
				{{#each model.grouped_messages}}
					<div class="case-detail-message-group-row">
						<div class="case-detail-message-date-section">
							<span class="case-detail-field-message-date">{{date}}</span>
						</div>
						{{#each messages}}
							<div class="case-detail-message-row {{#if initialMessage}}sc-highlighted{{/if}}">
								<div class="case-detail-message">
									<span class="case-detail-field-message-author">{{author}}</span>
									<span class="case-detail-field-message-field-message-time"> ({{messageDate}})</span>
									{{#if initialMessage}}
										<span class="case-detail-field-message-original">{{translate '- Original case message'}}</span>
									{{/if}}
								</div>
								<p class="case-detail-field-message-text" id="textURLtest">{{text}}</p>
							</div>
						{{/each}}
					</div>
				{{/each}}
				</div>
			</div>
		</div>
	</div>



<script type="text/javascript">

					//Get total num of cases
						
					var numofCases = JSON.stringify(document.getElementById("caseCount").innerHTML);
						console.log(numofCases);
					var conv_numofCases = numofCases.replace(/\D/g,'');
						console.log(conv_numofCases);

					//Access each case 
					console.log(document.getElementById("textURLtest").innerHTML);
					

					var urlStorage = [];
					var rawCaseVaue = [];
					var text1 = [];
					var cases = document.getElementsByClassName("case-detail-field-message-text");

					for (var i=0;i<conv_numofCases;i++)
					{
						
						
						console.log(cases[i].innerHTML);
						rawCaseVaue[i] = cases[i].innerHTML;


						var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
						text1[i]=rawCaseVaue[i].replace(exp, "<a href='$1'>$1</a>");

						var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;


						cases[i].innerHTML = text1[i].replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');

					}

				</script> 


			</section>



















</section>



{{!----
Use the following context variables when customizing this template: 
	
	model (Object)
	model.internalid (String)
	model.caseNumber (String)
	model.title (String)
	model.grouped_messages (Array)
	model.grouped_messages.0 (Object)
	model.grouped_messages.0.date (String)
	model.grouped_messages.0.messages (Array)
	model.grouped_messages.0.messages.0 (Object)
	model.grouped_messages.0.messages.0.author (String)
	model.grouped_messages.0.messages.0.text (String)
	model.grouped_messages.0.messages.0.messageDate (String)
	model.grouped_messages.0.messages.0.internalid (String)
	model.grouped_messages.0.messages.0.initialMessage (Boolean)
	model.status (Object)
	model.status.id (String)
	model.status.name (String)
	model.origin (Object)
	model.origin.id (String)
	model.origin.name (String)
	model.category (Object)
	model.category.id (String)
	model.category.name (String)
	model.company (Object)
	model.company.id (String)
	model.company.name (String)
	model.priority (Object)
	model.priority.id (String)
	model.priority.name (String)
	model.createdDate (String)
	model.lastMessageDate (String)
	model.email (String)
	model.messages_count (Number)
	pageHeader (String)
	collapseElements (Boolean)
	closeStatusId (Boolean)

----}}
