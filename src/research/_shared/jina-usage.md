# Jina Reader/Search usage

Jina Reader API converts URLs into clean, LLM-ready text:
- Search: https://s.jina.ai/?q=apply+for+business+licence+site:gov.sg
- Read:   https://r.jina.ai/https://www.example.gov.sg/services/apply-licence

Include the API key via HTTP header:
- Authorization: Bearer $JINA_API_KEY
