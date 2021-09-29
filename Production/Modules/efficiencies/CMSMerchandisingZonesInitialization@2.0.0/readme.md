This is a plugin to integrate standard Carrousel Item Views, provided by SCA, with CMS Merchandising zones.
We reuse all the code provided by the old merchandising zones, and glue them with cms.

This plugin won't work out of the box, some work needs to be done CMS side.

GLOSARY:
Proxy CXM Template: the UNDERSCORE template that goes on CXM side, with combiners and tags.
SCA Template: the HANDLEBARS template really used to render your CXM on SCA side.

Steps:


CASE 1: you want this merchandizing zones mechanism to be the default one
1) Go to your Netsuite Inc - CMS folder
2) Add merchzone_default_tmpl as the tag for merchzone_default.txt proxy template
3) Edit what's inside merchzone_default.txt. Add what's on this module's Internal/merchzone_default.txt
4) Now add this module to your distro.
5) Enjoy your merchzones! It's the same carrousel used for relateditems and recently viewed items.


CASE 2: you want this behavior to be just for specific merchandizing zones
1) Go to your Netsuite Inc - CMS Folder
2) Upload merchzone_cms proxy template, and specify merchzone_cms_tmpl as the TAG for the file
3) Add this module to your distros
4) On your merchandizing zones, on the advanced tab, put merchzone_cms_tmpl as the proxy Template
5) Enjoy your merchzones. Be aware of needing to specify the proxy tmpl each time you create a new merchandizing zone record.


CASE 3: you need to specify another kind of template for a specific merchandizing zone

PATH A) It's merch-zone based: (with this approach you have to add templates to CXM)
1) Follow steps from CASE 2, but with a new proxy tmpl and name for cxm.
2) on backbone trigger, use the parameter tpl to refer to the name of the SCA template that will be used. (don't put .tpl)
3) Create your new SCA template with the name specified on the step before.
3) on SCA, you have to manually require this SCA template as a dependency of this module.
4) don't forget to specify the proxy template from step 1 on your new merch zone record.

PATH B) you want to specify it on the CMS placeholder (With this approach you have to modify your placeholders on SCA)
1) edit the placeholder div, add data-template="merch_zone_cms2.tpl" (for example)
2) create that new SCA template
3) that's it. SCA Deployer is intelligent enough to recognize that it has to include that template.

Note: if both A and B are specified, B prevails.

Not supported:
Merch zone titles

