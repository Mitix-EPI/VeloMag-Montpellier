export interface Bike {
    id: number;
    priority: 'Low' | 'Important' | 'Urgent';
    reason: 'Brake problem' | 'Gear problem' | 'Seat problem' | 'Touch panel not working' | 'Other';
    date: Date;
    description: string;
    checked: boolean;
}
