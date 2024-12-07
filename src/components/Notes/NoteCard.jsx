import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive, faEdit, faBoxOpen, faMinus } from '@fortawesome/free-solid-svg-icons';

// Colors for categories
const COLORS = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800',
];

const NoteCard = ({
    id,
    title,
    content,
    isArchived,
    categories = [],
    availableCategories = [],
    onDelete,
    onArchive,
    onEdit,
    onAddCategory,
    onRemoveCategory,
}) => {
    const handleAddCategory = (e) => {
        const categoryId = e.target.value;
        if (categoryId) {
            onAddCategory(id, Number(categoryId));
            e.target.value = ''; // Reset selector
        }
    };

    const getCategoryColor = (index) => COLORS[index % COLORS.length];

    return (
        <li className="p-6 mb-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col gap-4">
            {/* Title and Content */}
            <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600">{content}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => onEdit(id)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit Note"
                >
                    <FontAwesomeIcon icon={faEdit} className="w-7 h-7" />
                </button>
                <button
                    onClick={() => onArchive(id, isArchived)}
                    className="text-blue-500 hover:text-blue-700"
                    title={isArchived ? 'Unarchive Note' : 'Archive Note'}
                >
                    <FontAwesomeIcon icon={isArchived ? faBoxOpen : faArchive} className="w-7 h-7" />
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Note"
                >
                    <FontAwesomeIcon icon={faTrash} className="w-7 h-7" />
                </button>
            </div>

            {/* Categories */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700">Categories:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <span
                                key={`${id}-${category.id}`}
                                className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getCategoryColor(
                                    index
                                )}`}
                            >
                                {category.name}
                                <button
                                    onClick={() => onRemoveCategory(id, category.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remove Category"
                                >
                                    <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">No categories assigned</span>
                    )}
                </div>
            </div>

            {/* Add Category Selector */}
            <div className="mt-2">
                <select
                    onChange={handleAddCategory}
                    className="border border-gray-300 rounded p-2 text-sm w-full focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Add category
                    </option>
                    {availableCategories
                        .filter((category) => !categories.some((c) => c.id === category.id))
                        .map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                </select>
            </div>
        </li>
    );
};

NoteCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isArchived: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    availableCategories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onAddCategory: PropTypes.func.isRequired,
    onRemoveCategory: PropTypes.func.isRequired,
};

export default NoteCard;
