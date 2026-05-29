define([], function() {
  'use strict';

  // Configuración de apariencia
  var appearanceSection = {
    uses: "settings",
    items: {
      colors: {
        type: "items",
        label: "Colores",
        items: {
          progressColor: {
            ref: "props.progressColor",
            label: "Color de Progreso",
            type: "string",
            expression: "optional",
            defaultValue: "#D32F2F"
          },
          backgroundColor: {
            ref: "props.backgroundColor",
            label: "Color de Fondo",
            type: "string",
            expression: "optional",
            defaultValue: "#E0E0E0"
          },
          overflowColor: {
            ref: "props.overflowColor",
            label: "Color Excedente (>100%)",
            type: "string",
            expression: "optional",
            defaultValue: "#FF6F00"
          }
        }
      },
      design: {
        type: "items",
        label: "Diseño",
        items: {
          strokeWidth: {
            ref: "props.strokeWidth",
            label: "Grosor del Anillo",
            type: "number",
            expression: "optional",
            defaultValue: 12,
            min: 5,
            max: 30
          },
          showPercentage: {
            ref: "props.showPercentage",
            label: "Mostrar Porcentaje",
            type: "boolean",
            defaultValue: true
          },
          fontSize: {
            ref: "props.fontSize",
            label: "Tamaño de Fuente",
            type: "number",
            expression: "optional",
            defaultValue: 24,
            min: 10,
            max: 60,
            show: function(data) {
              return data.props.showPercentage;
            }
          },
          animationDuration: {
            ref: "props.animationDuration",
            label: "Duración de Animación (ms)",
            type: "number",
            expression: "optional",
            defaultValue: 500,
            min: 0,
            max: 2000
          }
        }
      },
      advanced: {
        type: "items",
        label: "Avanzado",
        items: {
          showLabel: {
            ref: "props.showLabel",
            label: "Mostrar Etiqueta",
            type: "boolean",
            defaultValue: false
          },
          labelText: {
            ref: "props.labelText",
            label: "Texto de Etiqueta",
            type: "string",
            expression: "optional",
            defaultValue: "Progreso",
            show: function(data) {
              return data.props.showLabel;
            }
          },
          roundedCaps: {
            ref: "props.roundedCaps",
            label: "Extremos Redondeados",
            type: "boolean",
            defaultValue: true
          }
        }
      }
    }
  };

  // Definición completa de propiedades
  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: {
        uses: "dimensions",
        min: 0,
        max: 0  // NO permitir dimensiones
      },
      measures: {
        uses: "measures",
        min: 1,
        max: 1,  // SOLO una medida
        items: {
          label: {
            label: "Medida (debe retornar 0-100)",
            description: "La medida debe retornar un valor entre 0 y 100 representando el porcentaje"
          }
        }
      },
      sorting: {
        uses: "sorting"
      },
      addons: {
        uses: "addons",
        items: {
          dataHandling: {
            uses: "dataHandling"
          }
        }
      },
      appearance: appearanceSection
    }
  };
});