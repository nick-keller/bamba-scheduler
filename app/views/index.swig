{% extends 'layout.swig' %}

{% block stylesheets %}
  {% parent %}
  <link rel="stylesheet" href="/components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
{% endblock %}

{% block content %}
  <h1>{{ title }}</h1>
  <h3>Ajouter une tâche</h3>
  <form method="post" action="/add-task">
    <div class="form-group">
      <label for="taskType">Type de tâche</label>
      <select id="taskType" name="taskType" class="form-control">
        <option value="build">Construire un bâtiment</option>
      </select>
    </div>
    <div class="form-group">
      <label for="building">Bâtiment à construire</label>
      <select id="building" name="building" class="form-control">
        {% for building in buildings %}
          <option value="{{ loop.key }}">{{ building }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="form-group">
      <label for="baseId">ID de la base</label>
      <input type="text" class="form-control" name="baseId" id="baseId" placeholder="ID de la base" value="16309">
    </div>
    <div class="form-group">
      <label for="executionTime">Date</label>
      <div class="input-group date" id='datetimepicker'>
          <input type="text" class="form-control" name="executionTime" id="executionTime" />
          <span class="input-group-addon">
              <span class="glyphicon glyphicon-calendar"></span>
          </span>
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Ajouter</button>
  </form>
  {% if tasks|length > 0 %}
    <h3>Tâches planifiées</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <td>Tâche</td>
          <td>Date</td>
          <td>Répéter</td>
          <td>Répétée</td>
          <td>Réponses du serveur</td>
        </tr>
      </thead>
      <tbody>
        {% for task in tasks %}
          <tr>
            <td>
              {% if task.type == 'build' %}
                Construction {{ buildings[task.options.building] }} sur {{ task.options.baseId }}
              {% endif %}
            </td>
            <td>{{task.executionTime|datetime}}, {{task.executionTime|dateFromNow}}</td>
            <td>{{task.repeat}}</td>
            <td>{{task.repeated}}</td>
            <td>
              <ul>
                {% for response in task.responses %}<li>{{response}}</li>{% endfor %}
              </ul>
            </td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  {% endif %}
{% endblock %}

{% block javascripts %}
  {% parent %}
  <script type="text/javascript" src="/components/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="/components/moment/locale/fr.js"></script>
  <script type="text/javascript" src="/components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
  <script type="text/javascript">
      $(function () {
          $('#datetimepicker').datetimepicker();
      });
  </script>
{% endblock %}
