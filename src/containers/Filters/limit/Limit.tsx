import {
    ChangeEvent,
    FC,
    useState,
} from 'react';

import limitStyles from './Limit.module.css';
import { Realty } from '~/src/models/Realty';
import { observer } from 'mobx-react-lite';

interface CheckboxPropsType {
    step?: number;
    label: string;
    min?: number;
    max?: number;
    filterName: string;
    realties: Realty[]
    onSetFilter: (filter) => void;
}

const Limit: FC<CheckboxPropsType> = ({
    filterName,
    label,
    step = 0.25,
    realties,
    onSetFilter,
}) => {
    const now = new Date();
    const minYear = now.getFullYear();
    const month = now.getMonth() + 1;
    const currentQuarter = Math.ceil(month / 3);
    const min = minYear + (currentQuarter * step - step);

    const max = realties
        ?.map(({
            constructionDeadlineYear,
            constructionDeadlineQuarter
        }) => constructionDeadlineYear + constructionDeadlineQuarter * 0.25)
        .sort((a, b) => a - b)[0];

    const [value, setValue] = useState(max);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.currentTarget.value)
        const year = Math.floor(value);
        const quarter = (value - year) * 4 + 1;

        setValue(value);
        onSetFilter({[filterName]: [year, quarter]})
    }

    function valueLabelFormat(value: number) {
        const units = ['Q1', 'Q2', 'Q3', 'Q4'];
        let unitIndex = (value - Math.floor(value)) * 4;

        return `${units[unitIndex]} ${Math.floor(value)}`;
    }

    return (
        <div className={limitStyles.content}>
            <label>{label}</label>

            <input
                type={'range'}
                value={value}
                min={min - 0.25}
                max={max}
                step={step}
                onChange={handleChange}
            />

            <div style={{fontSize: 'small'}}>
                {value < min ? 'finished' : `not later than ${valueLabelFormat(value)}`}
            </div>
        </div>
    );
}

export default observer(Limit);
