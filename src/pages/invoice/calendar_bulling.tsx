import { CalendarOutlined } from "@ant-design/icons"
import { Badge, Calendar, DatePicker, type BadgeProps, type CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";


const dateFormat = 'YYYYMMDD';

function CalendarBulling() {
    const { RangePicker } = DatePicker;
    const [startDate, setStartDate] = useState(dayjs().format(dateFormat));
    const [endDate, setEndDate] = useState(dayjs().format(dateFormat));

    const getListData = (value: Dayjs) => {
        let listdata: { type: string, content: string }[] = [];
        switch (value.date()) {
            case 1:
                listdata = [
                    { type: 'processing', content: 'This is a bulling time.' }
                ];
                break;
            case 2:
                listdata = [
                    { type: 'processing', content: 'This is a bulling time.' }
                ];
                break;
            case 30:
                listdata = [
                    { type: 'processing', content: 'This is a bulling time.' }
                ];
                break;
            case 31:
                listdata = [
                    { type: 'processing', content: 'This is a bulling time.' }
                ];
                break;
            default:
        }
        return listdata || [];
    }

    const getMonthData = (value: Dayjs) => {
        if (value.month() === 11) {
            return 1394;
        }
    }

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                {/* <section>{num}</section> */}
                <span>Backloh Number</span>
            </div>
        ) : null
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="event">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type as BadgeProps['status']} text={item.content} className="font-semibold"/>
                    </li>
                ))}
            </ul>
        )
    };

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") {
            return dateCellRender(current);
        }
        if (info.type === "month") {
            return monthCellRender(current);
        }
        return info.originNode;
    };


    return (
        <div className="text-gray-700 font-semibold text-lg">
            <CalendarOutlined /> CREATE CALENDAR
            <hr className="my-2" />
            <div className="flex flex-col gap-5">
                <div className="flex flex-row justify-end items-center gap-2">
                    <RangePicker
                        value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
                        format={dateFormat}
                        onChange={(dates, dateStrings) => {
                            if (dates) {
                                setStartDate(dateStrings[0]);
                                setEndDate(dateStrings[1]);
                            }
                        }}
                    />
                    <button
                        className='bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:outline-none focus:ring-[#608BC1] font-bold rounded-lg border-black text-white text-lg px-6 py-5 md:px-10 md:py-1 text-center'
                    // onClick={handleRegisterUser}
                    >
                        CREATE
                    </button>
                </div>
                <div className="border border-gray-200 rounded-lg">
                    <Calendar className="m-2" cellRender={cellRender} />
                </div>
            </div>

        </div>
    )
}

export default CalendarBulling