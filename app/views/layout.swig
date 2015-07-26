<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  {% block stylesheets %}
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
  {% endblock %}
</head>
<body>
  <div class="container-fluid">
    <div class="col-sm-12">
      {% block content %}{% endblock %}
    </div>
  </div>
  {% block javascripts %}
    {% if ENV_DEVELOPMENT %}
      <script src="http://localhost:35729/livereload.js"></script>
    {% endif %}
    <script src="components/jquery/dist/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  {% endblock %}
</body>
</html>
