
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select, Tag } from "antd";
import { FileProtectOutlined, PrinterOutlined, SearchOutlined, LinkOutlined, FilePdfOutlined, FileSearchOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import serviceMain from "../../service/confirm.service";
import service from "../../service/account.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EBilling_ConfirmACModalDetail from "./EBilling_ConfirmACModalDetail";
import EBilling_ConfirmACDetailPrint from "./EBilling_ConfirmACDetailPrint";

dayjs.extend(isBetween);

const { Option } = Select;

interface InvoiceDetail {
    key: React.Key;
    address: string;
    billerby: string;
    billerdate: string;
    date: string;
    documentno: string;
    duedate: string;
    netpaid: number;
    paymenT_TERMS: string;
    receiveD_BILLERBY: string;
    receiveD_BILLERDATE: string;
    taxid: string;
    totaL_AMOUNT: number;
    vendorcode: string;
    vendorname: string;
    whtax: number;
    status: string; // เพิ่ม field status
    invoicedate: string;
    invoiceno: string;
}

export default function EBilling_ConfirmAC() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [status, setStatus] = useState<string>("%");
    const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDetailModalOpenPrint, setIsDetailModalOpenPrint] = useState(false);
    const [detailRecord, setDetailRecord] = useState<InvoiceDetail | null>(null);
    const [documentNo, setDocumentNo] = useState("");
    const [vendor, setVendor] = useState<string>("%");
    const [vendorList, setVendorList] = useState<any[]>([]);
    const [ACType, setACType] = useState<string>("%");



    useEffect(() => {

    }, [auth.username]);


    useEffect(() => {
        serviceMain.getVendor().then((res) => {
            try {
                setVendorList(res.data);
            } catch (error) {
                console.error(error);
            }
        });
    }, []);



    const onSearch = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({ icon: "warning", title: "Please select Document dates." });
            return;
        }

        try {
            setLoading(true);
            const res = await service.ReportConfirmHeader({
                venderCode: vendor,
                invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
                invoiceDateTo: toDate.format("YYYY-MM-DD"),
                status: status,
                actype: ACType
            });
            const filteredData = res.data

            console.log("xcxf", filteredData)
            setDataSource(filteredData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "NO", width: 60, align: "center", render: (_: any, __: any, index: number) => index + 1,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "BILLING NO", dataIndex: "documentno", width: 150, align: "center", fixed: "left",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "DUE DATE",
            dataIndex: "duedate",
            width: 120,
            align: "center",
            render: (_: any, record: InvoiceDetail) => record.duedate,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "AC TYPE", dataIndex: "actype", width: 100, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        // {
        //     title: "TAX ID", dataIndex: "taxid", width: 150, align: "center",
        //     onHeaderCell: () => ({
        //         style: {
        //             backgroundColor: "rgb(167 213 255)",
        //             color: "black",
        //             fontWeight: "bold",
        //         },
        //     }),
        // },
        {
            title: "VENDOR CODE", dataIndex: "vendorcode", width: 150, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "VENDER NAME",
            dataIndex: "vendorname",
            width: 250,
            align: "center",
            render: (value: any) => <div style={{ textAlign: "left" }}>{value}</div>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "PAYMENT TERMS", dataIndex: "paymenT_TERMS", width: 150, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totaL_AMOUNT",
            width: 150,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "W/H TAX",
            dataIndex: "whtax",
            width: 120,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "NET PAID",
            dataIndex: "netpaid",
            width: 150,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            width: 150,
            align: "center",
            fixed: "right", // ติดขวา
            render: (value: string) => {
                if (!value) return "-";

                const raw = value.trim();
                const status = raw.toLowerCase();

                if (status === "payment") {
                    return <Tag color="green">PAYMENT</Tag>;
                }

                if (status === "confirm") {
                    return <Tag color="blue">CONFIRM</Tag>;
                }

                if (raw.toUpperCase() === "WAITING_VENDOR") {
                    return <Tag color="orange">Waiting Vendor Confirm</Tag>;
                }

                if (raw.toUpperCase() === "WAITING_DCI") {
                    return <Tag color="gold">Waiting DCI Confirm</Tag>;
                }

                if (raw.toUpperCase() === "CANCEL_PAYMENT") {
                    return <Tag color="red">CANCEL PAYMENT</Tag>;
                }

                if (raw.toUpperCase() === "CANCEL") {
                    return <Tag color="red">CANCEL CONFIRM</Tag>;
                }

                return <Tag color="red">{value}</Tag>; // อื่นๆ แสดงตามเดิม
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "DETAIL",
            width: 80,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <FileSearchOutlined
                    style={{ fontSize: 18, color: "#15c915", cursor: "pointer" }}
                    onClick={() => {
                        setDetailRecord(record);
                        setIsDetailModalOpen(true);
                    }}
                />
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "DOCUMENT",
            width: 100,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <FilePdfOutlined
                    style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                    onClick={() =>
                        window.open(
                            `$"{file:///D:/Project/2025/INVOICEBILLINENOTE_API/Uploads}/${record.filE_NAME}"`,
                            "_blank"
                        )
                    }
                />
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "PRINT",
            width: 80,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <PrinterOutlined
                    style={{ fontSize: 18, color: "black", cursor: "pointer" }}
                    onClick={() => {
                        setDetailRecord(record.documentno); // ✅ เฉพาะแถวที่กด
                        setIsDetailModalOpenPrint(true);
                    }}
                />
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        }

    ];

    const getGrandTotalAmount = () => dataSource.reduce((sum, item) => sum + Number(item.totaL_AMOUNT ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getGrandTotalWHTax = () => dataSource.reduce((sum, item) => sum + Number(item.whtax ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getGrandTotalNetPaid = () => dataSource.reduce((sum, item) => sum + Number(item.netpaid ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });


    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FileProtectOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>
                    Confirm Billing
                </p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Form layout="inline" style={{ alignItems: "center" }}>

                    <Form.Item
                        style={{ marginRight: 10, fontSize: 14, fontWeight: 500, height: 32, display: "flex", alignItems: "center" }}
                    >
                        Invoice Date
                    </Form.Item>

                    <Form.Item
                        style={{ marginRight: 5, height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        From :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={fromDate}
                            onChange={setFromDate}
                            style={{ height: 32, width: 120 }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "0 5px", height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        To :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={toDate}
                            onChange={setToDate}
                            style={{ height: 32, width: 120 }}
                        />
                    </Form.Item>



                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>Select Vendor :</span>
                    <Form.Item>
                        <Select
                            showSearch
                            value={vendor}
                            onChange={setVendor}
                            style={{ width: 350, height: 32 }}
                            placeholder="เลือก Vendor"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            <Select.Option value="%">All</Select.Option>

                            {vendorList.map((item, index) => (
                                <Select.Option key={index} value={item.vender.trim()}>
                                    {item.vdname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>AC Type :</span>
                    <Form.Item>
                        <Select value={ACType} onChange={setACType} style={{ width: 200, height: 32 }}>
                            <Option value="%">ALL</Option>
                            <Option value="G">G : GENERAL PURCHASE</Option>
                            <Option value="O">O : OTHERS</Option>
                            <Option value="R">R : RAW MATERIAL</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        style={{ margin: "0 5px", height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        Status :
                    </Form.Item>
                    <Form.Item>
                        <Select value={status} onChange={setStatus} style={{ width: 200, height: 32 }}>
                            <Option value="%">All</Option>
                            <Option value="WAITING_VENDOR">Waiting Vendor Confirm</Option>
                            <Option value="WAITING_DCI">Waiting DCI Confirm</Option>
                            <Option value="CONFIRM">Confirm</Option>
                            <Option value="REJECT">Reject</Option>
                            <Option value="PAYMENT">Payment</Option>
                        </Select>
                    </Form.Item>




                    {/* <span style={{ margin: "0 10px", fontWeight: 500, fontSize: 14 }}>Document No :</span>
                    <Form.Item>
                        <input
                            type="text"
                            value={documentNo}
                            onChange={(e) => setDocumentNo(e.target.value)}
                            style={{ width: 250, height: 32, padding: "0 10px", borderRadius: 4, border: "1px solid #d9d9d9" }}
                        />
                    </Form.Item> */}

                    <Form.Item>
                        <Button
                            type="primary"
                            onClick={onSearch}
                            loading={loading}
                            style={{ height: 32 }}
                        >
                            Search
                        </Button>
                    </Form.Item>

                </Form>
            </div>


            <div style={{ maxHeight: 600 }} className="customTable">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: "max-content", y: 600 }}
                    tableLayout="fixed"
                    sticky
                    bordered
                    pagination={false}
                    loading={loading}
                    rowClassName={(record: MData) => {
                        const raw = record.status?.trim();
                        const status = raw?.toLowerCase();

                        if (status === "payment") return "row-payment";
                        if (status === "confirm") return "row-confirm";
                        if (status === "waiting") return "row-waiting";
                        if (status === "reject") return "row-reject";
                        if (status === "cancel") return "row-reject";
                        if (status === "cancel_payment") return "row-reject";


                        if (raw?.toUpperCase() === "WAITING_VENDOR") return "row-wait-vendor";
                        if (raw?.toUpperCase() === "WAITING_DCI") return "row-wait-dci";

                        return "";
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell colSpan={7} align="center">Grand Total</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalAmount()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalWHTax()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalNetPaid()}</Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            {/* <EBilling_DetailModalVendor
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearch}
            /> */}



            <EBilling_ConfirmACModalDetail
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearch}
            />

            <EBilling_ConfirmACDetailPrint
                open={isDetailModalOpenPrint}
                onClose={() => setIsDetailModalOpenPrint(false)}
                documentNo={detailRecord}
                refreshData={onSearch}
            />
        </div>
    );
}
