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
        progressColor: "#D32F2F",
        backgroundColor: "#E0E0E0",
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

      // ✨ NUEVA LÓGICA: Detectar formato y normalizar a porcentaje 0-100
      var percentage;
      if (value <= 1 && value >= 0) {
        // Formato decimal (0.5 = 50%, 0.75 = 75%)
        percentage = value * 100;
      } else if (value > 1 && value <= 100) {
        // Formato porcentaje (50 = 50%, 75 = 75%)
        percentage = value;
      } else if (value > 100) {
        // Valor fuera de rango superior, limitar a 100%
        percentage = 100;
      } else {
        // Valor negativo, poner en 0%
        percentage = 0;
      }

      // Asegurar rango final 0-100
      percentage = Math.min(100, Math.max(0, percentage));

      // Obtener el label de la medida (opcional)
      var measureLabel = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;

      // Calcular matemática del círculo
      var radius = 45 - (strokeWidth / 2);
      var circumference = 2 * Math.PI * radius;
      var offset = circumference - (percentage / 100) * circumference;

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
        html += percentage.toFixed(0) + '%';
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

      // Animar el círculo de progreso después del render
      setTimeout(function() {
        var circle = $element.find('.progress-circle');
        if (circle.length) {
          circle.css('stroke-dashoffset', offset);
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