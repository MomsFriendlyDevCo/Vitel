function t(e,c){var r={locale:Intl.DateTimeFormat().resolvedOptions().locale,currency:!1,...c};return new Intl.NumberFormat(r.locale,{...r.currency===!0?{style:"currency",currency:"AUD"}:typeof r.currency=="string"?{style:"currency",currency:r.currency}:{}}).format(e)}export{t as F};