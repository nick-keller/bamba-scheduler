{% extends 'layout.swig' %}

{% block content %}
  <h1>{{ title }}</h1>
  <p>Coucou</p>
  <table class="table table-bordered">
    <thead>
      <tr>
        <td>Type</td>
        <td>Target</td>
        <td>ExecutionTime</td>
      </tr>
    </thead>
    <tbody>
      {% for task in tasks %}
        <tr>
          <td>task.type</td>
          <td>task.target</td>
          <td>task.executionTime</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
{% endblock %}
