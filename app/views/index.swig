{% extends 'layout.swig' %}

{% block stylesheets %}
  {% parent %}
  <link rel="stylesheet" href="components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2-bootstrap.css" />
{% endblock %}

{% block content %}
  <h1>{{ title }}</h1>
  <h3>Ajouter une tâche</h3>
  <form method="post" action="add-task">
    <div class="form-group">
      <label for="taskType">Type de tâche</label>
      <select id="taskType" name="taskType" class="form-control" required="required">
        <option>-- Sélectionner --</option>
        <option value="buildbuilding">Construire un bâtiment</option>
        <option value="buildtechno">Rechercher une techonologie</option>
        <option value="buildship">Construire un vaisseau</option>
      </select>
    </div>
    <div class="form-group next-select" style="display:none;" id="buildbuilding">
      <label for="building">Bâtiment à construire</label>
      <select id="building" name="building" class="form-control select2">
        <option>-- Sélectionner --</option>
        {% for building in buildings %}
          <option value="{{ loop.key }}">{{ building }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="form-group next-select" style="display:none;" id="buildtechno">
      <label for="technoSelect">Recherche à faire</label>
      <select id="technoSelect" name="techno" class="form-control select2">
        <option>-- Sélectionner --</option>
        {% for techno in technos %}
          <option value="{{ loop.key }}">{{ techno }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="next-select" style="display:none;" id="buildship">
      <div class="form-group">
        <label for="shipSelect">Vaisseau à construire</label>
        <select id="shipSelect" name="ship" class="form-control select2">
          <option>-- Sélectionner --</option>
          {% for ship in ships %}
            <option value="{{ loop.key }}">{{ ship }}</option>
          {% endfor %}
        </select>
      </div>
      <div class="form-group">
        <label for="quantity">Quantité</label>
        <input type="number" class="form-control" name="quantity" id="quantity" placeholder="Quantité" value="1">
      </div>
    </div>
    <div class="form-group">
      <label for="baseId">ID de la base</label>
      <input type="text" class="form-control" name="baseId" id="baseId" placeholder="ID de la base" value="16309" required="required">
    </div>
    <div class="form-group">
      <label for="executionTime">Date</label>
      <div class="input-group date" id='datetimepicker'>
          <input type="text" class="form-control" name="executionTime" id="executionTime" required="required" />
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
              {% if task.type == 'buildbuilding' %}
                Construction {{ buildings[task.options.building] }} sur {{ task.options.baseId }}
              {% elseif task.type == 'buildtechno' %}
                Recherche {{ technos[task.options.techno] }} sur {{ task.options.baseId }}
              {% elseif task.type == 'buildship' %}
                Construction {{ task.options.quantity }} {{ ships[task.options.ship] }} sur {{ task.options.baseId }}
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
  <script type="text/javascript" src="components/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="components/moment/locale/fr.js"></script>
  <script type="text/javascript" src="components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.js"></script>
  <script type="text/javascript">
      $(function () {
          $('#datetimepicker').datetimepicker();
          $('#taskType').change(function(e) {
            $('.next-select').hide(500, function() {
              $('#' + $(e.target).val()).show(500);
            });
          });
          $('.select2').select2();
      });
  </script>
{% endblock %}
