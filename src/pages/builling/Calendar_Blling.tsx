import { CalendarOutlined } from "@ant-design/icons"
import { Badge, Calendar, DatePicker, type BadgeProps, type CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import type { ReduxInterface } from "../../interface/main.interface";
import { useSelector } from "react-redux";
import { API_CREATECALENDARBILLING } from "../../service/infobilling.service";
import type { CrCalendar } from "../../interface/mParam";
import Swal from "sweetalert2";


const dateFormat = 'YYYYMMDD';

function CalendarBulling() {
    const { RangePicker } = DatePicker;
    const [billingStr, setBillingStr] = useState(dayjs().format(dateFormat));
    const [billingEnd, setBillingEnd] = useState(dayjs().format(dateFormat));
    const [paymentStr, setPaymentStr] = useState(dayjs().format(dateFormat));
    const [paymentEnd, setPaymentEnd] = useState(dayjs().format(dateFormat));

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);

    const role = redux.authen.role;

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
                        <Badge status={item.type as BadgeProps['status']} text={item.content} className="font-semibold" />
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

    const handleCreateCalendarBilling = async () => {
        try {
            const crdcalendar = await API_CREATECALENDARBILLING({
                cldYear: dayjs(billingStr).format('YYYY'),
                cldMonth: dayjs(billingStr).format('MM'),
                billingStart: billingStr,
                billingEnd: billingEnd,
                paymentStart: null,
                paymentEnd: null,
                crBy: redux.authen.username
            });

            if (crdcalendar.result === 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'สร้างปฏิทินการวางบิลสำเร็จ',
                    text: 'ทำการสร้างปฏิทินการวางบิลเรียบร้อยแล้ว.'
                });
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
            console.error(error);
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
                        <span className="text-sm text-black font-bold">กำหนดวันวางบิล:</span>
                        <RangePicker
                            value={[dayjs(billingStr, dateFormat), dayjs(billingEnd, dateFormat)]}
                            format={dateFormat}
                            onChange={(dates, dateStrings) => {
                                if (dates) {
                                    setBillingStr(dateStrings[0]);
                                    setBillingEnd(dateStrings[1]);
                                }
                            }}
                        />
                        <button
                            className='bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:outline-none focus:ring-[#608BC1] font-bold rounded-lg border-black text-white text-sm px-6 py-5 md:px-5 md:py-1.5 text-center'
                            onClick={handleCreateCalendarBilling}
                        >
                            CREATE
                        </button>
                    </div>
                )}
                {role == 'rol_vender' ? (
                    null
                ) : (
                    <div className="flex flex-row justify-center items-center gap-2">
                        <span className="text-sm text-black font-bold">กำหนดวันจ่ายเงิน:</span>
                        <RangePicker
                            value={[dayjs(paymentStr, dateFormat), dayjs(paymentEnd, dateFormat)]}
                            format={dateFormat}
                            onChange={(dates, dateStrings) => {
                                if (dates) {
                                    setPaymentStr(dateStrings[0]);
                                    setPaymentEnd(dateStrings[1]);
                                }
                            }}
                        />
                        <button
                            className='bg-orange-500 hover:bg-orange-600 focus:ring-3 focus:outline-none focus:ring-[#c18760] font-bold rounded-lg border-black text-white text-sm px-6 py-5 md:px-5 md:py-1.5 text-center'
                        // onClick={handleRegisterUser}
                        >
                            CREATE
                        </button>
                    </div>
                )}
                <hr className="border-gray-100" />
                <div className="border border-gray-200 rounded-lg bg-pink-200">
                    <Calendar className="m-2 bg-pink-200" cellRender={cellRender} />
                </div>
            </div>

        </div>
    )
}

export default CalendarBulling