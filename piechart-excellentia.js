define([
  'jquery',
  './properties',
  'css!./piechart-excellentia.css'
], function($, properties) {
  'use strict';

  return {
    // Propiedades de la extensión
    definition: properties,

    // Configuración inicial
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1
        }]
      },
      props: {
        measureFormat: "decimal",
        progressColor: "#D32F2F",
        backgroundColor: "#E0E0E0",
        overflowColor: "#FF6F00",
        strokeWidth: 12,
        showPercentage: true,
        fontSize: 24,
        animationDuration: 500,
        showLabel: false,
        labelText: "Progreso",
        roundedCaps: true
      }
    },

    // Soporte para exportación
    support: {
      snapshot: true,
      export: true,
      exportData: true
    },

    // Función principal de renderizado
    paint: function($element, layout) {
      var self = this;
      
      // Limpiar contenedor
      $element.empty();

      // Obtener configuración
      var props = layout.props || {};
      var progressColor = props.progressColor || '#D32F2F';
      var backgroundColor = props.backgroundColor || '#E0E0E0';
      var overflowColor = props.overflowColor || '#FF6F00';
      var measureFormat = props.measureFormat || 'decimal';
      var strokeWidth = props.strokeWidth || 12;
      var showPercentage = props.showPercentage !== false;
      var fontSize = props.fontSize || 24;
      var animationDuration = props.animationDuration || 500;
      var showLabel = props.showLabel || false;
      var labelText = props.labelText || 'Progreso';
      var roundedCaps = props.roundedCaps !== false;

      // Obtener datos del hypercube
      var qData = layout.qHyperCube.qDataPages[0];
      
      // Validar que hay datos
      if (!qData || !qData.qMatrix || qData.qMatrix.length === 0) {
        $element.html('<div class="kpi-error">No hay datos disponibles</div>');
        return;
      }

      // Obtener valor de la medida
      var qMatrix = qData.qMatrix[0];
      var value = qMatrix[0].qNum;
      
      // Validar datos
      if (value === null || value === undefined || isNaN(value)) {
        value = 0;
      }

      // Normalizar según formato configurado (sin auto-detección)
      var rawPercentage;
      if (measureFormat === 'percentage') {
        rawPercentage = value;
      } else {
        // decimal: 0.85 = 85%, 1.4 = 140%
        rawPercentage = value * 100;
      }
      if (rawPercentage < 0) rawPercentage = 0;

      var isOverflow = rawPercentage > 100;
      var displayPercentage = isOverflow ? 100 : rawPercentage;
      var overflowPercentage = isOverflow ? rawPercentage % 100 : 0;

      // Obtener el label de la medida (opcional)
      var measureLabel = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;

      // Calcular matemática del círculo
      var radius = 45 - (strokeWidth / 2);
      var circumference = 2 * Math.PI * radius;
      var offset = circumference - (displayPercentage / 100) * circumference;
      var overflowOffset = circumference - (overflowPercentage / 100) * circumference;

      // Construir HTML
      var html = '<div class="progress-pie-container">';
      
      // SVG del gráfico
      html += '<svg viewBox="0 0 100 100" class="progress-ring" xmlns="http://www.w3.org/2000/svg">';
      
      // Círculo de fondo
      html += '<circle ';
      html += 'cx="50" cy="50" ';
      html += 'r="' + radius + '" ';
      html += 'stroke="' + backgroundColor + '" ';
      html += 'stroke-width="' + strokeWidth + '" ';
      html += 'fill="none" ';
      html += 'class="progress-bg-circle"';
      html += '/>';
      
      // Círculo de progreso
      html += '<circle ';
      html += 'cx="50" cy="50" ';
      html += 'r="' + radius + '" ';
      html += 'stroke="' + progressColor + '" ';
      html += 'stroke-width="' + strokeWidth + '" ';
      html += 'fill="none" ';
      html += 'stroke-dasharray="' + circumference + '" ';
      html += 'stroke-dashoffset="' + circumference + '" ';
      html += 'stroke-linecap="' + (roundedCaps ? 'round' : 'butt') + '" ';
      html += 'transform="rotate(-90 50 50)" ';
      html += 'class="progress-circle" ';
      html += 'data-offset="' + offset + '" ';
      html += 'style="transition: stroke-dashoffset ' + animationDuration + 'ms ease"';
      html += '/>';

      // Arco de overflow (solo cuando supera el 100%)
      if (isOverflow) {
        html += '<circle ';
        html += 'cx="50" cy="50" ';
        html += 'r="' + radius + '" ';
        html += 'stroke="' + overflowColor + '" ';
        html += 'stroke-width="' + strokeWidth + '" ';
        html += 'fill="none" ';
        html += 'stroke-dasharray="' + circumference + '" ';
        html += 'stroke-dashoffset="' + circumference + '" ';
        html += 'stroke-linecap="' + (roundedCaps ? 'round' : 'butt') + '" ';
        html += 'transform="rotate(-90 50 50)" ';
        html += 'class="overflow-circle" ';
        html += 'data-offset="' + overflowOffset + '" ';
        html += 'style="transition: stroke-dashoffset ' + animationDuration + 'ms ease"';
        html += '/>';
      }

      // Texto central (porcentaje)
      if (showPercentage) {
        html += '<text ';
        html += 'x="50" y="50" ';
        html += 'text-anchor="middle" ';
        html += 'dominant-baseline="middle" ';
        html += 'class="percentage-text" ';
        html += 'font-size="' + fontSize + '" ';
        html += 'fill="#333333"';
        html += '>';
        html += rawPercentage.toFixed(0) + '%';
        html += '</text>';
      }
      
      html += '</svg>';
      
      // Etiqueta inferior (opcional)
      if (showLabel) {
        html += '<div class="progress-label">';
        html += labelText || measureLabel;
        html += '</div>';
      }
      
      html += '</div>';

      // Inyectar HTML
      $element.html(html);

      // Animar los círculos después del render
      setTimeout(function() {
        var circle = $element.find('.progress-circle');
        if (circle.length) {
          circle.css('stroke-dashoffset', offset);
        }
        var overflowCircle = $element.find('.overflow-circle');
        if (overflowCircle.length) {
          overflowCircle.css('stroke-dashoffset', overflowOffset);
        }
      }, 50);

      // Retornar qlik.Promise resuelto
      return window.qlik.Promise.resolve();
    },

    // Función de resize (opcional)
    resize: function($element, layout) {
      // El SVG con viewBox es responsive por defecto
      // Solo repintamos si es necesario
      return this.paint($element, layout);
    }
  };
});