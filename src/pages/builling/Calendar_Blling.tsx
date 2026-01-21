import { CalendarOutlined } from "@ant-design/icons"
import { Badge, Calendar, DatePicker, Select, type BadgeProps, type CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import type { ReduxInterface } from "../../interface/main.interface";
import { useSelector } from "react-redux";
import { API_CALENDAR, API_CREATECALENDARBILLING, API_TYPECALENDAR } from "../../service/infobilling.service";
import Swal from "sweetalert2";
import type { ResCalendar, ResTypeCalendar } from "../../interface/response.interface";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

const dateFormat = 'YYYYMMDD';

function CalendarBulling() {
    const { RangePicker } = DatePicker;
    const [dateStr, setDateStr] = useState(dayjs().format(dateFormat));
    const [dateEnd, setDateEnd] = useState(dayjs().format(dateFormat));
    const [calendarData, setCalendarData] = useState<ResCalendar[]>([]);
    const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs());
    const [typeCld, setTypeCld] = useState<ResTypeCalendar[]>([]);
    const [typecldSelected, setTypecldSelected] = useState<string>('');


    const redux: ReduxInterface = useSelector((state: any) => state.reducer);
    const role = redux.authen.role;

    const fetchCalendar = async (date: Dayjs) => {
        try {
            const res = await API_CALENDAR(date.year());
            if (res.data) {
                setCalendarData(res.data);
            } else {
                setCalendarData([]);
            }
        } catch (err) {
            setCalendarData([]);
        }
    };

    const fetchTypeCalendar = async () => {
        try {
            const res = await API_TYPECALENDAR();
            if (res) {
                setTypeCld(res);
            } else {
                setTypeCld([]);
            }
        } catch (err) {
            setTypeCld([]);
        }
    }

    useEffect(() => {
        const initDate = dayjs();
        setCalendarValue(initDate);
        fetchCalendar(initDate);

        fetchTypeCalendar();
    }, []);

    const typecldOptions = typeCld.map(cld => ({
        label: `${cld.dicttitle}`,
        value: cld.dictrefno
    }));

    const getListData = (value: Dayjs) => {
        const listData: { type: string; content: string }[] = [];
        const currentDate = value.startOf('day');

        if (!calendarData || !Array.isArray(calendarData)) return listData;

        calendarData.forEach(item => {
            if (item.eventtype == "billing") {
                const start = dayjs(item.startdate, 'DD-MM-YYYY').startOf('day');
                const end = dayjs(item.enddate, 'DD-MM-YYYY').startOf('day');
                // console.log(currentDate.format('DD-MM-YYYY'), start.format('DD-MM-YYYY'), end.format('DD-MM-YYYY'));

                if (currentDate.isBetween(start, end, null, '[]')) {
                    listData.push({ type: 'processing ', content: 'วันวางบิล' });
                }
            }

            if (item.eventtype == "payment") {
                const start = dayjs(item.startdate, 'DD-MM-YYYY').startOf('day');
                const end = dayjs(item.enddate, 'DD-MM-YYYY').startOf('day');
                // console.log(currentDate.format('DD-MM-YYYY'), start.format('DD-MM-YYYY'), end.format('DD-MM-YYYY'));

                if (currentDate.isBetween(start, end, null, '[]')) {
                    listData.push({ type: 'warning', content: 'วันจ่ายเงิน' });
                }
            }

            if (item.eventtype == "cutoff") {
                const start = dayjs(item.startdate, 'DD-MM-YYYY').startOf('day');
                const end = dayjs(item.enddate, 'DD-MM-YYYY').startOf('day');

                if (currentDate.isBetween(start, end, null, '[]')) {
                    listData.push({ type: 'default', content: 'วันตัดรอบรับเอกสาร' });
                }
            }

            if (item.eventtype == "vacation") {
                const start = dayjs(item.startdate, 'DD-MM-YYYY').startOf('day');
                const end = dayjs(item.enddate, 'DD-MM-YYYY').startOf('day');
                
                if (currentDate.isBetween(start, end, null, '[]')) {
                    listData.push({ type: 'success', content: 'วันหยุดนักขัตฤกษ์' });
                }
            }
        });

        // console.log(currentDate.format('YYYYMMDD'), listData);
        return listData;
    };
    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        // console.log(value.format)
        return (
            <ul className="event">
                {listData.map((item) => (
                    <li key={`${item.type}-${item.content}`}>
                        <Badge size="default" status={item.type as BadgeProps['status']} text={item.content} className="font-semibold bg-amber-50 px-4 py-2 rounded-lg" />
                    </li>
                ))}
            </ul>
        );
    };

    // const getMonthData = (value: Dayjs) => {
    //     if (value.month() === 11) {
    //         return 1394;
    //     }
    // }

    // const monthCellRender = (value: Dayjs) => {
    //     const num = getMonthData(value);
    //     return num ? (
    //         <div className="notes-month">
    //             {/* <section>{num}</section> */}
    //             <span>Backloh Number</span>
    //         </div>
    //     ) : null
    // };


    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") {
            return dateCellRender(current);
        }
        // if (info.type === "month") {
        //     return monthCellRender(current);
        // }
        return info.originNode;
    };

    const handleCreateCalendar = async () => {
        try {
            const crdcalendar = await API_CREATECALENDARBILLING({
                cldYear: dayjs(dateStr).format('YYYY'),
                cldMonth: dayjs(dateStr).format('MM'),
                dateStart: dateStr,
                dateEnd: dateEnd,
                cldType: typecldSelected,
                crBy: redux.authen.incharge
            });

            if (crdcalendar.result === 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'สร้างปฏิทินการวางบิลสำเร็จ',
                    text: crdcalendar?.message || 'ทำการสร้างปฏิทินการวางบิลเรียบร้อยแล้ว.'
                }).then(() => {
                    fetchCalendar(calendarValue);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถสร้างปฏิทินได้',
                    text: crdcalendar?.message || 'เกิดข้อผิดพลาด'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
            });
            // console.error(error);
        }
    };

    return (
        <div className="text-gray-700 font-semibold text-lg">
            <CalendarOutlined /> BLLING CALENDAR
            <hr className="my-2" />
            <div className="flex flex-col gap-5">
                {role == 'rol_vender' ? (
                    null
                ) : (
                    <div className="flex flex-row justify-center items-center gap-2">
                        {/* <span className="text-sm text-black font-bold">กำหนดวันวางบิล:</span> */}
                        <Select
                            showSearch={{
                                filterOption: (input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                            }}
                            placeholder="Slect Type Calendar"
                            options={typecldOptions}
                            onChange={(value) => setTypecldSelected((value))}
                            className="w-48"
                        />
                        <RangePicker
                            value={[dayjs(dateStr, dateFormat), dayjs(dateEnd, dateFormat)]}
                            format={dateFormat}
                            onChange={(dates, dateStrings) => {
                                if (dates) {
                                    setDateStr(dateStrings[0]);
                                    setDateEnd(dateStrings[1]);
                                }
                            }}
                        />
                        <button
                            className='bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:outline-none focus:ring-[#608BC1] font-bold rounded-lg border-black text-white text-sm px-6 py-5 md:px-5 md:py-1.5 text-center'
                            onClick={handleCreateCalendar}
                        >
                            CREATE
                        </button>
                    </div>
                )}
                <hr className="border-gray-100" />
                <div className="flex flex-col justify-start">
                    <div className="flex flex-row items-center">
                        <Badge size="default" status="processing" className="font-semibold px-4 py-2 rounded-lg" />
                        <span className="text-lg font-normal">วันวางบิล</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <Badge size="default" status="warning" className="font-semibold px-4 py-2 rounded-lg" />
                        <span className="text-lg font-normal">วันจ่ายเงิน</span>
                    </div>
                </div>
                <div className="border border-gray-200 rounded-lg bg-gray-200">
                    <Calendar
                        value={calendarValue}
                        className="m-2 bg-gray-200"
                        cellRender={cellRender}
                        onPanelChange={(date) => {
                            setCalendarValue(date);
                            fetchCalendar(date);
                        }}
                    />

                </div>
            </div>

        </div>
    )
}

export default CalendarBulling