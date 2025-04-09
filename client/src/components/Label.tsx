/**
 * Props for the Label component.
 * 
 * @typedef {Object} LabelProps
 * @property {string} label - The text to be displayed inside the label.
 * @property {string} bgClass - The CSS class for the background styling of the label.
 * @property {string} colorClass - The CSS class for the color of the text inside the label.
 */

/**
 * A functional component that renders a label with specified text, background class, and text color.
 * 
 * @component
 * @example
 * const label = "Hello World"
 * const bgClass = "bg-primary"
 * const color = "warning"
 * return (
 *   <Label label={label} bgClass={bgClass} color={color} />
 * )
 */

type LabelProps = {
  label: string,
  bgClass: string,
  color: string
}

const Label = ({ label, bgClass, color }: LabelProps) => {
  return (
    <div className={`bg-${bgClass} text-${color}`}>
      {label}
    </div>
  )
}

export default Label
